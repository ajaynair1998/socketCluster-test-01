import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import SingleColumnSelection from "../Selection";
import { useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";

export interface ISingleItemProps {
	name: string;
	id: string;
	selectedSide?: string;
	disabled?: boolean;
	color?:
		| "inherit"
		| "success"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "warning"
		| undefined;
}

const Room = ({ playerId }: { playerId?: string }) => {
	let { data } = useSelector((state: IStore) => state.socketStore);
	let [timer, setTimer] = useState<string>("");

	useEffect(() => {
		if (data.playerId === data.all_data.playerOneId) {
			if (data.playerTwoDisabled) {
				setTimer(data.timer);
			} else {
				setTimer("wait for the opponent to make a move");
			}
		}
		if (data.playerId === data.all_data.playerTwoId) {
			if (data.playerOneDisabled) {
				setTimer(data.timer);
			} else {
				setTimer("Wait for the opponent to make a move");
			}
		}
	}, [data.timer]);
	if (data.is_completed === false) {
		return (
			<React.Fragment>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					{" "}
					<Typography variant="h3">{data.playerId}</Typography>{" "}
				</Box>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					{" "}
					<Typography variant="h3">{timer}</Typography>{" "}
				</Box>
				<Grid
					container
					direction={"row"}
					width={"70%"}
					mx={"auto"}
					mt={"200px"}
				>
					<SingleColumnSelection color={"success"} selectedSide={"playerOne"} />
					<SingleColumnSelection selectedSide="selection-column" />
					<SingleColumnSelection color={"error"} selectedSide={"playerTwo"} />
				</Grid>
			</React.Fragment>
		);
	} else {
		return <RoomNotActive />;
	}
};

const RoomNotActive = () => {
	return (
		<React.Fragment>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}
			>
				{" "}
				<Typography variant="h3">
					Room is not active or it is completed
				</Typography>{" "}
			</Box>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}
			>
				{" "}
			</Box>
		</React.Fragment>
	);
};

export default Room;
