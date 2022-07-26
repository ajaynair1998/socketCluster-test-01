import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import SocketClusterClient from "socketcluster-client";
import { createSocket, socketClusterSocket } from "../../configs";
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
import { roomId } from "../../configs";

const PlayerOne = () => {
	let dispatch = useDispatch();
	const [socket, setSocket] = useState<
		SocketClusterClient.AGClientSocket | undefined | null
	>(null);
	// const [joined, setJoined] = useState(false);
	// const { data } = useSelector((state: IStore) => state.socketStore);

	// useEffect(() => {
	// 	const newSocket = createSocket("room-one");
	// 	console.log(data);
	// 	newSocket?.emit("join-game", {
	// 		playerId: data.playerId,
	// 		roomId: data.roomId,
	// 	});
	// 	if (newSocket) {
	// 		dispatch(setSelectedSocket(newSocket));
	// 		dispatch(setSelectedPlayerId("player-one"));
	// 		dispatch(setSelectedroomId("room-one"));

	// 		setSocket(newSocket);
	// 		setJoined(true);
	// 	}

	// 	return () => {
	// 		socket?.close();
	// 	};
	// }, []);

	// useEffect(() => {
	// 	if (socket) {
	// 		socket.on("current-game-state", (data: any) => {
	// 			if (data) {
	// 				console.log(
	// 					"socket-connected",
	// 					socket.connected,
	// 					"response recieved"
	// 				);
	// 				if (data && data.data && data.data.is_completed === true) {
	// 					dispatch(setIsCompleted(data.data.is_completed));
	// 				}

	// 				if (data && data.data && data.data.id) {
	// 					dispatch(setSelectedAllSquadPlayers(data.data.playersAvailable));
	// 					dispatch(setSelectedPlayerOneSquad(data.data.playerOneSquad));
	// 					dispatch(setPlayerOneId(data.data.playerOneId));
	// 					dispatch(setPlayerTwoId(data.data.playerTwoId));
	// 					dispatch(setSelectedPlayerTwoSquad(data.data.playerTwoSquad));
	// 					dispatch(setPlayerOneDisabled(!data.data.playerOneTurn));
	// 					dispatch(setPlayerTwoDisabled(!data.data.playerTwoTurn));
	// 					dispatch(setTimer(data.data.timer));
	// 					dispatch(setAllData(data.data));
	// 				}
	// 			}
	// 		});
	// 	}
	// }, [socket]);

	// useEffect(() => {
	// 	console.log("player or room id changed");
	// 	if (data.socket) {
	// 		data?.socket?.emit("join-game", {
	// 			playerId: data.playerId,
	// 			roomId: data.roomId,
	// 		});
	// 	}
	// }, [data.roomId, data.playerId]);

	useEffect(() => {
		console.log(socket);
	}, [socket]);
	useEffect(() => {
		handleSubscriptionOnInitialisation();
	}, []);
	const handleSubscriptionOnInitialisation = () => {
		try {
			(async () => {
				let channel = socketClusterSocket.subscribe(roomId);
				let data = await socketClusterSocket.invoke("join-game", {
					data: {
						roomId: roomId,
					},
				});
				setSocket(socketClusterSocket);
				console.log("🚀 ~ file: index.tsx ~ line 107 ~ data", data);

				for await (let data of channel) {
					console.log("🚀 ~ file: index.jsx ~ line 33 ~ forawait ~ data", data);
					// ... Handle channel data.
				}
			})();
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Box>
			<Room />
		</Box>
	);
};

export default PlayerOne;
