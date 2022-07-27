import AGServer from "socketcluster-server";
import { database } from "../db";
import { roomId } from "../helpers";
import { IRoom } from "../helpers/interfaces";
import gameController from "./gameController";

const socketConnectionController = {
	main: async (
		socket: AGServer.AGServerSocket,
		agServer: AGServer.AGServer
	): Promise<any> => {
		try {
			let exchange = agServer.exchange;
			let clients = agServer.clients;

			console.log(
				"🚀 ~ file: SocketConnectionController.js ~ line 8 ~ main: ~ clients",
				Object.keys(clients)
			);
			(async () => {
				for await (let rpc of socket.procedure("join-game")) {
					let value = socket.isSubscribed("room-one");
					console.log("is subscribed", value);
					await agServer.exchange.transmitPublish(
						"room-one",
						"you have been connected to room-one"
					);
					rpc.end("success");
				}
			})();
			(async () => {
				let channelName = roomId + "-action-on-player";
				console.log(
					"🚀 ~ file: SocketConnectionController.ts ~ line 49 ~ channelName",
					channelName
				);
				for await (let channelData of agServer.exchange.subscribe(
					channelName
				)) {
					console.log(channelData);
					let { roomId, playerId, selectedSquadPlayerId } = channelData;
					let value = socket.isSubscribed("channel-one");
					console.log("is subscribed", value);
					await socketConnectionController.action_on_player(
						agServer,
						roomId,
						playerId,
						selectedSquadPlayerId
					);
					await agServer.exchange.transmitPublish(roomId, "This is some data");
				}
			})();
		} catch (err) {
			console.log(err);
		}
	},
	create_room: async (roomId: string = "room-one") => {
		try {
			let playersAvailable = {
				sdf3: { id: "sdf3", name: "gohan", points: 1 },
				sdf4: { id: "sdf4", name: "goku", points: 2 },
				sdf5: { id: "sdf5", name: "vegeta", points: 3 },
				sdf6: { id: "sdf6", name: "naruto", points: 4 },
				sdf7: { id: "sdf7", name: "piccolo", points: 5 },
				sdf8: { id: "sdf8", name: "conor", points: 6 },
				sdf9: { id: "sdf9", name: "khabib", points: 7 },
				sdf10: { id: "sdf10", name: "gsp", points: 8 },
				sdf11: { id: "sdf11", name: "olievera", points: 9 },
				sdf12: { id: "sdf12", name: "chandler", points: 10 },
				sdf13: { id: "sdf13", name: "bisping", points: 11 },
				sdf14: { id: "sdf14", name: "izzy", points: 12 },
			};
			const room: IRoom = {
				id: roomId,
				playerOneSquad: {},
				playerTwoSquad: {},
				playerOneId: "player-one",
				playerTwoId: "player-two",
				playersAvailable: playersAvailable,
				playerOneTurn: false,
				playerTwoTurn: false,
				timer: 5,
				time_elapsed: [],
				player_one_actions_available: 0,
				player_two_actions_available: 0,
				is_completed: false,
			};

			await database.set(roomId, JSON.stringify(room));
			// console.log("room created");
		} catch (err) {
			console.log(err);
		}
	},
	action_on_player: async (
		agServer: AGServer.AGServer,
		roomId: string,
		playerId: string,
		selectedSquadPlayerId: string
	) => {
		try {
			let room: any = await database.get(roomId);
			if (!room) {
				return;
			}
			room = JSON.parse(room);
			if (roomId && room) {
				console.log("joined room", roomId);
				let roomToBeSelected = room;
				let selectedRoom: IRoom = { ...roomToBeSelected };
				let allPlayersThatAreAvailable = selectedRoom.playersAvailable;
				let selectedPlayer = allPlayersThatAreAvailable[selectedSquadPlayerId];

				if (
					playerId === "player-one" &&
					selectedRoom.playerOneTurn === true &&
					selectedRoom.player_one_actions_available > 0
				) {
					delete allPlayersThatAreAvailable[selectedSquadPlayerId];
					selectedRoom.playersAvailable = allPlayersThatAreAvailable;
					selectedRoom.playerOneSquad[selectedSquadPlayerId] = selectedPlayer;
					selectedRoom.player_one_actions_available = 0;
				}
				if (
					playerId === "player-two" &&
					selectedRoom.playerTwoTurn === true &&
					selectedRoom.player_two_actions_available > 0
				) {
					delete allPlayersThatAreAvailable[selectedSquadPlayerId];
					selectedRoom.playersAvailable = allPlayersThatAreAvailable;
					selectedRoom.playerTwoSquad[selectedSquadPlayerId] = selectedPlayer;
					selectedRoom.player_two_actions_available = 0;
				}
				room = selectedRoom;
				await database.set(roomId, JSON.stringify(room));

				await agServer.exchange.transmitPublish(roomId, {
					data: selectedRoom,
				});
				console.log("data sent to ", roomId);
				return;
			}
		} catch (err) {
			console.log(err);
		}
	},
};
export default socketConnectionController;
