import { database } from "../db";
import { Request, Response } from "express";
import { IPlayer, IRoom } from "../helpers/interfaces";
import socketConnectionController from "./SocketConnectionController";
import { currentExactTime, delay, roomId } from "../helpers";
import { AGServer } from "socketcluster-server";

interface IStartGameParams {
	agServer: AGServer;
	roomId: string;
	playerOneId: string;
	playerTwoId: string;
	squadForGame?: IPlayer[];
}
let gameController = {
	main: async function (params: IStartGameParams): Promise<any> {
		try {
			// create the room
			await socketConnectionController.create_room(params.roomId);

			(async () => {
				for await (let { socket } of params.agServer.listener("connection")) {
					(async () => {
						let roomJoiningProcess = "join-game-" + params.roomId;
						for await (let rpc of socket.procedure(roomJoiningProcess)) {
							let value = socket.isSubscribed(roomId);
							console.log("is subscribed", value);
							await params.agServer.exchange.transmitPublish(
								roomId,
								"you have been connected to room-one"
							);
							rpc.end("success");
						}
					})();

					(async () => {
						let channelName = params.roomId + "-action-on-player";
						for await (let channelData of params.agServer.exchange.subscribe(
							channelName
						)) {
							console.log(channelData);
							let { roomId, playerId, selectedSquadPlayerId } = channelData;
							let value = socket.isSubscribed("channel-one");
							console.log("is subscribed", value);
							await socketConnectionController.action_on_player(
								params.agServer,
								roomId,
								playerId,
								selectedSquadPlayerId
							);
							await params.agServer.exchange.transmitPublish(
								roomId,
								"This is some data"
							);
						}
					})();
				}
			})();

			for (let i = 0; i < 6; i++) {
				await this.game_loop(params.roomId, params);
			}
			// there will be a player not selected if we dont check after the loop is completed
			await gameController.assign_player_automatically_if_unresponsive(
				params.playerTwoId,
				params.roomId,
				params
			);
			await gameController.change_game_state_to_completed(
				params.roomId,
				params
			);
			return gameController.main({
				agServer: params.agServer,
				roomId: params.roomId,
				playerOneId: "player-one",
				playerTwoId: "player-two",
			});
		} catch (err) {
			console.log(err);
		}
	},

	game_loop: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			await gameController.assign_player_automatically_if_unresponsive(
				params.playerTwoId,
				roomId,
				params
			);
			await gameController.pass_control_to_player_one(roomId, params);
			for (let i = 5; i >= 0; i--) {
				let actionsLeft = await gameController.check_if_actions_left(
					params.playerOneId,
					roomId,
					params
				);
				if (actionsLeft) {
					await delay(1000);
					let currentTime = currentExactTime();
					if (
						roomId === "room-4000" ||
						roomId === "room-3000" ||
						roomId === "room-2000"
					) {
						console.log(currentTime);
					}
					await this.change_timer_value(i, roomId, params);
				}
			}
			await gameController.assign_player_automatically_if_unresponsive(
				params.playerOneId,
				roomId,
				params
			);
			await gameController.pass_control_to_player_two(roomId, params);
			for (let i = 5; i >= 0; i--) {
				let actionsLeft = await gameController.check_if_actions_left(
					params.playerTwoId,
					roomId,
					params
				);
				if (actionsLeft) {
					await delay(1000);
					await this.change_timer_value(i, roomId, params);
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
	change_timer_value: async function (
		timeLeft: number,
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);
			let selectedRoom: IRoom = room;

			selectedRoom.timer = timeLeft;
			let time_list = selectedRoom.time_elapsed;
			let timeNow = currentExactTime();
			time_list.push([timeLeft, timeNow]);
			selectedRoom.time_elapsed = time_list;
			await database.set(roomId, JSON.stringify(room));
			let timeNowAfterSaving = currentExactTime();
			await params.agServer.exchange.transmitPublish(roomId, {
				data: selectedRoom,
			});
			return;
		} catch (err) {
			console.log(err);
		}
	},
	pass_control_to_player_one: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);

			let selectedRoom: IRoom = room;
			selectedRoom.playerOneTurn = true;
			selectedRoom.playerTwoTurn = false;
			selectedRoom.player_one_actions_available = 1;
			await database.set(roomId, JSON.stringify(room));
			await params.agServer.exchange.transmitPublish(roomId, {
				data: selectedRoom,
			});
			return;
		} catch (err) {
			console.log(err);
		}
	},
	pass_control_to_player_two: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);

			let selectedRoom: IRoom = room;
			selectedRoom.playerOneTurn = false;
			selectedRoom.playerTwoTurn = true;
			selectedRoom.player_two_actions_available = 1;

			await database.set(roomId, JSON.stringify(room));
			await params.agServer.exchange.transmitPublish(roomId, {
				data: selectedRoom,
			});
			return;
		} catch (err) {
			console.log(err);
		}
	},
	assign_player_automatically_if_unresponsive: async function (
		playerId: string,
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);
			let roomToBeSelected = room;
			let selectedRoom: IRoom = { ...roomToBeSelected };

			if (selectedRoom.playerOneId === playerId) {
				if (selectedRoom.player_one_actions_available > 0) {
					let sortable: [string, IPlayer][] = [];
					for (const playerId in selectedRoom.playersAvailable) {
						sortable.push([playerId, selectedRoom.playersAvailable[playerId]]);
					}
					sortable.sort((a: any, b: any) => b[1].points - a[1].points);
					let idOfPlayerWithMaxPoints = sortable[0][0];
					let maxPlayerDetails = sortable[0][1];

					// now add this player to player one's squad and delete it from the pool
					selectedRoom.playerOneSquad[idOfPlayerWithMaxPoints] =
						maxPlayerDetails;
					delete selectedRoom.playersAvailable[idOfPlayerWithMaxPoints];

					await database.set(roomId, JSON.stringify(room));
				} else {
					return;
				}
			} else if (selectedRoom.playerTwoId === playerId) {
				if (selectedRoom.player_two_actions_available > 0) {
					let sortable: [string, IPlayer][] = [];
					for (const playerId in selectedRoom.playersAvailable) {
						sortable.push([playerId, selectedRoom.playersAvailable[playerId]]);
					}
					sortable.sort((a: any, b: any) => b[1].points - a[1].points);
					let idOfPlayerWithMaxPoints = sortable[0][0];
					let maxPlayerDetails = sortable[0][1];

					// now add this player to player one's squad and delete it from the pool
					selectedRoom.playerTwoSquad[idOfPlayerWithMaxPoints] =
						maxPlayerDetails;
					delete selectedRoom.playersAvailable[idOfPlayerWithMaxPoints];

					await database.set(roomId, JSON.stringify(room));
				} else {
					return;
				}
			}
			await params.agServer.exchange.transmitPublish(roomId, {
				data: selectedRoom,
			});

			return;
		} catch (err) {
			console.log(err);
		}
	},
	change_game_state_to_completed: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			console.log("\x1b[32m%s\x1b[0m", "game instance has completed");
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);

			let selectedRoom: IRoom = room;
			selectedRoom.is_completed = true;

			await database.set(roomId, JSON.stringify(room));

			await params.agServer.exchange.transmitPublish(roomId, {
				data: selectedRoom,
			});
			return;
		} catch (err) {
			console.log(err);
		}
	},
	check_if_actions_left: async function (
		playerId: string,
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			// console.log("\x1b[32m%s\x1b[0m", "checking if actions left");
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);

			let selectedRoom: IRoom = room;
			if (selectedRoom.playerOneId === playerId) {
				if (selectedRoom.player_one_actions_available > 0) {
					return true;
				} else {
					return false;
				}
			} else if (selectedRoom.playerTwoId === playerId) {
				if (selectedRoom.player_two_actions_available > 0) {
					return true;
				} else {
					return false;
				}
			}

			return true;
		} catch (err) {
			console.log(err);
			return true;
		}
	},
};
export default gameController;
