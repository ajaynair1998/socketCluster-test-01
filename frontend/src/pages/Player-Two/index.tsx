import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import { createSocket } from "../../configs";
import { Box, Grid } from "@mui/material";
import Room from "../../components/Room";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";
import {
	setAllData,
	setIsCompleted,
	setPlayerOneDisabled,
	setPlayerOneId,
	setPlayerTwoDisabled,
	setPlayerTwoId,
	setSelectedAllSquadPlayers,
	setSelectedPlayerId,
	setSelectedPlayerOneSquad,
	setSelectedPlayerTwoSquad,
	setSelectedroomId,
	setSelectedSocket,
	setTimer,
} from "../../redux/reducers/SocketDataReducer";

const PlayerTwo = () => {
	let dispatch = useDispatch();
	const [socket, setSocket] = useState<
		Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null
	>(null);
	const [joined, setJoined] = useState(false);
	const { data } = useSelector((state: IStore) => state.socketStore);

	useEffect(() => {
		const newSocket = createSocket("room-one");
		newSocket?.emit("join-game", {
			playerId: data.playerId,
			roomId: data.roomId,
		});
		if (newSocket) {
			dispatch(setSelectedSocket(newSocket));
			dispatch(setSelectedPlayerId("player-two"));
			dispatch(setSelectedroomId("room-one"));

			setSocket(newSocket);
			setJoined(true);
		}

		return () => {
			socket?.close();
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("current-game-state", (data: any) => {
				if (data) {
					console.log(
						"socket-connected",
						socket.connected,
						"response recieved"
					);
					console.log("data recieved from server");

					if (data && data.data && data.data.is_completed === true) {
						dispatch(setIsCompleted(data.data.is_completed));
					}

					if (data && data.data && data.data.id) {
						dispatch(setSelectedAllSquadPlayers(data.data.playersAvailable));
						dispatch(setSelectedPlayerOneSquad(data.data.playerOneSquad));

						dispatch(setPlayerOneId(data.data.playerOneId));
						dispatch(setPlayerTwoId(data.data.PlayerTwoId));
						dispatch(setSelectedPlayerTwoSquad(data.data.playerTwoSquad));
						dispatch(setTimer(data.data.timer));

						dispatch(setPlayerOneDisabled(!data.data.playerOneTurn));
						dispatch(setPlayerTwoDisabled(!data.data.playerTwoTurn));
						dispatch(setAllData(data.data));
					}
				}
			});
		}
	}, [socket]);

	useEffect(() => {
		console.log("playerId or roomId changed");
		if (data.socket) {
			data?.socket?.emit("join-game", {
				playerId: data.playerId,
				roomId: data.roomId,
			});
		}
	}, [data.roomId, data.playerId]);

	return (
		<Box>
			<Room />
		</Box>
	);
};

export default PlayerTwo;
