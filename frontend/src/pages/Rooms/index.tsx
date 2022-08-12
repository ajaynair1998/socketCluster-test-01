import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BasicTextField from "../../components/BasicTextField";
import RoomDetailCard from "../../components/RoomDetailCard";
import axios from "axios";
import { ip } from "../../configs";

const Rooms = () => {
	let navigate = useNavigate();

	let [rooms, setRooms] = useState<{ [key: string]: string }>({});
	let [instanceIp, setInstanceIp] = useState<string>("");

	useEffect(() => {
		getAllRoomDetails();
	}, []);

	const signInAsPlayerOne = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		roomId: string
	) => {
		try {
			event.preventDefault();
			navigate("../player-one", {
				replace: false,
				state: { roomId: roomId },
			});
		} catch (err) {
			console.log(err);
		}
	};

	const getAllRoomDetails = async () => {
		try {
			let { data } = await axios.get(`http://${ip[2]}:80/all-rooms`);
			let roomDetails: any = data.data.dbData;

			let instanceIp: string = data.data.ip;

			setRooms(roomDetails);
			setInstanceIp(instanceIp);
		} catch (err: any) {
			console.log(err);
		}
	};

	const signInAsPlayerTwo = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		roomId: string
	) => {
		try {
			event.preventDefault();
			navigate("../player-two", { replace: false, state: { roomId: roomId } });
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Box width={"100%"}>
			<Grid
				container
				width={"100%"}
				direction={"column"}
				alignContent={"center"}
				justifyContent={"flex-start"}
				justifyItems={"flex-start"}
				// sx={{ height: "100vh" }}
			>
				{Object.entries(rooms).map((room) => {
					let id = room[0];
					let roomData: any = room[1];
					console.log(
						"🚀 ~ file: index.tsx ~ line 73 ~ {Object.entries ~ roomData",
						roomData
					);
					return (
						<RoomDetailCard
							key={id}
							signInAsPlayerOne={signInAsPlayerOne}
							signInAsPlayerTwo={signInAsPlayerTwo}
							roomId={roomData.id}
							instanceIp={roomData.instanceIp}
							playerOneId={roomData.playerOneId}
							playerTwoId={roomData.playerTwoId}
							timer={roomData.timer}
							timeElapsed={roomData.time_elapsed}
						/>
					);
				})}
			</Grid>
		</Box>
	);
};

export default Rooms;
