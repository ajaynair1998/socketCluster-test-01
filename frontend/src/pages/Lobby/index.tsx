import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
	let navigate = useNavigate();
	const signInAsPlayerOne = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		try {
			event.preventDefault();
			navigate("../player-one", { replace: false });
		} catch (err) {
			console.log(err);
		}
	};

	const signInAsPlayerTwo = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		try {
			event.preventDefault();
			navigate("../player-two", { replace: false });
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Box>
			<Grid
				container
				direction={"column"}
				alignContent={"center"}
				justifyContent={"space-evenly"}
				sx={{ height: "100vh" }}
			>
				<Grid item>
					<Button
						color="success"
						onClick={(e) => {
							signInAsPlayerOne(e);
						}}
					>
						Sign in as player One
					</Button>
				</Grid>
				<Grid item>
					<Button
						color="warning"
						onClick={(e) => {
							signInAsPlayerTwo(e);
						}}
					>
						Sign in as player Two
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Lobby;
