import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { Button } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IProps {
	signInAsPlayerOne: (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		roomId: string
	) => void;
	signInAsPlayerTwo: (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		roomId: string
	) => void;
	roomId: string;
	playerOneId: string;
	playerTwoId: string;
	instanceIp: string;
	timer: number | string;
	isCompleted?: boolean;
	timeElapsed: any;
}
const RoomDetailAccordion = (props: IProps) => {
	const [expanded, setExpanded] = React.useState<string | false>(false);
	const [roomId, setRoomId] = React.useState<string>("room-aeraf-1231-sadfasf");
	const [roomState, setRoomState] = React.useState<string>("In progress");
	const [playerTwoId, setPlayerTwoId] = React.useState<string>("player-two");
	const [playerOneId, setPlayerOneId] = React.useState<string>("player-one");
	const [instanceIp, setInstanceIp] = React.useState<string>("12.23.45.2123");
	const [timer, setTimer] = React.useState<number | string>(5);
	const [timeElapsed, setTimeElapsed] = React.useState<any>([]);

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	React.useEffect(() => {
		setRoomId(props.roomId);
		if (props.isCompleted) {
			setRoomState("completed");
		} else {
			setRoomState("in progress");
		}
		setInstanceIp(props.instanceIp);
		setPlayerOneId(props.playerOneId);
		setPlayerTwoId(props.playerTwoId);
		setTimer(props.timer);
		setTimeElapsed(props.timeElapsed);
	}, [props]);
	return (
		<div>
			<Accordion
				expanded={expanded === "panel2"}
				onChange={handleChange("panel2")}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel2bh-content"
					id="panel2bh-header"
				>
					<Typography sx={{ width: "50%", flexShrink: 0 }}>{roomId}</Typography>
					<Typography sx={{ color: "text.secondary", mr: 2 }}>
						<Button
							sx={{ my: 0 }}
							variant="contained"
							size="small"
							aria-label="move all right"
						>
							{roomState}
						</Button>
					</Typography>
					<Typography sx={{ color: "text.secondary" }}>
						<Button
							sx={{ my: 0 }}
							variant="contained"
							size="small"
							aria-label="move all right"
						>
							{instanceIp}
						</Button>
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ width: "100%!important" }}>
					{/* <Typography>
						Donec placerat, lectus sed mattis semper, neque lectus feugiat
						lectus, varius pulvinar diam eros in elit. Pellentesque convallis
						laoreet laoreet.
					</Typography> */}
					<Grid
						container
						spacing={1}
						direction="column"
						justifyContent={"flex-start"}
						alignContent={"flex-start"}
						width={"800px"}
					>
						<Grid item xs container direction="row" spacing={2}>
							<Grid item xs={3}>
								<Button
									sx={{ my: 0.5 }}
									variant="outlined"
									size="small"
									onClick={(e) => props.signInAsPlayerOne(e, roomId)}
									aria-label="move all right"
								>
									Join as player one
								</Button>
							</Grid>
							<Grid item xs={3}>
								<Button
									sx={{ my: 0.5 }}
									variant="outlined"
									size="small"
									aria-label="move all right"
									onClick={(e) => props.signInAsPlayerTwo(e, roomId)}
								>
									join as player two
								</Button>
							</Grid>
						</Grid>
						<Grid item xs container direction={"row"}>
							<Grid item xs={3}>
								<Typography>player one id </Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography>- </Typography>
							</Grid>
							<Grid item xs={3}>
								<Typography>{playerOneId}</Typography>
							</Grid>
						</Grid>
						<Grid item xs container direction={"row"}>
							<Grid item xs={3}>
								<Typography>player two id </Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography>- </Typography>
							</Grid>
							<Grid item xs={3}>
								<Typography>{playerTwoId}</Typography>
							</Grid>
						</Grid>
						<Grid item xs container direction={"row"}>
							<Grid item xs={3}>
								<Typography>timer</Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography>- </Typography>
							</Grid>
							<Grid item xs={3}>
								<Typography>{timer}</Typography>
							</Grid>
						</Grid>
						<Grid item mt={5}>
							<Typography variant="h5">Timer Delay Log</Typography>
						</Grid>

						{timeElapsed.map((item: any) => {
							return (
								<Grid item xs container direction={"row"}>
									<Grid item xs={3}>
										<Typography>{item[0]}</Typography>
									</Grid>
									<Grid item xs={1}>
										<Typography>- </Typography>
									</Grid>
									<Grid item xs={3}>
										<Typography>{item[1]}</Typography>
									</Grid>
								</Grid>
							);
						})}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default RoomDetailAccordion;
