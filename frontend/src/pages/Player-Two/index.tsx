import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import SocketClusterClient from "socketcluster-client";
import {
	createSocket,
	IState,
	socketClusterSocket,
	userId,
} from "../../configs";
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
import { useLocation } from "react-router-dom";

const PlayerTwo = () => {
	let dispatch = useDispatch();
	let location: IState = useLocation() as IState;

	let { roomId } = location.state;
	console.log("🚀 ~ file: index.tsx ~ line 38 ~ PlayerOne ~ roomId", roomId);
	const [socket, setSocket] = useState<
		SocketClusterClient.AGClientSocket | undefined | null
	>(null);

	const updateStateWithLatestData = (data: any) => {
		try {
			if (data) {
				if (data && data.data && data.data.is_completed === true) {
					dispatch(setIsCompleted(data.data.is_completed));
				}

				if (data && data.data && data.data.id) {
					dispatch(setSelectedAllSquadPlayers(data.data.playersAvailable));
					dispatch(setSelectedPlayerOneSquad(data.data.playerOneSquad));
					dispatch(setPlayerOneId(data.data.playerOneId));
					dispatch(setPlayerTwoId(data.data.playerTwoId));
					dispatch(setSelectedPlayerTwoSquad(data.data.playerTwoSquad));
					dispatch(setPlayerOneDisabled(!data.data.playerOneTurn));
					dispatch(setPlayerTwoDisabled(!data.data.playerTwoTurn));
					dispatch(setTimer(data.data.timer));
					dispatch(setAllData(data.data));
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		// console.log(socket);
	}, [socket]);

	useEffect(() => {
		handleSubscriptionOnInitialisation();
		dispatch(setSelectedPlayerId("player-two"));
		dispatch(setSelectedroomId(roomId));
	}, []);

	const handleSubscriptionOnInitialisation = () => {
		try {
			(async () => {
				let channel = socketClusterSocket.subscribe(roomId);
				// let joinGameProcedure = "join-game-" + roomId;
				// let data = await socketClusterSocket.invoke(joinGameProcedure, {
				// 	data: {
				// 		roomId: roomId,
				// 	},
				// });
				setSocket(socketClusterSocket);
				dispatch(setSelectedSocket(socketClusterSocket));
				// console.log("🚀 ~ file: index.tsx ~ line 107 ~ data", data);

				for await (let data of channel) {
					// console.log("🚀 ~ file: index.jsx ~ line 33 ~ forawait ~ data", data);
					// ... Handle channel data
					updateStateWithLatestData(data);
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

export default PlayerTwo;
