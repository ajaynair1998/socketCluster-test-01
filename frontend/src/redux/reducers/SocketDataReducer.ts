import { createSlice } from "@reduxjs/toolkit";

export const SocketDataSlice = createSlice({
	name: "socket",
	initialState: {
		data: {
			socket: null,
			roomId: "room-one",
			playerId: null,
			playerOneSquad: {},
			playerTwoSquad: {},
			allSquadPlayers: {},
			playerOneDisabled: false,
			playerTwoDisabled: false,
			playerOneId: "",
			playerTwoId: "",
			is_completed: false,
			timer: "",
			all_data: {},
		},
	},
	reducers: {
		setSelectedSocket: (state: any, action: any) => {
			state.data.socket = action.payload;
		},
		setSelectedroomId: (state: any, action: any) => {
			state.data.roomId = action.payload;
		},
		setSelectedPlayerId: (state: any, action: any) => {
			state.data.playerId = action.payload;
		},
		setSelectedPlayerOneSquad: (state: any, action: any) => {
			state.data.playerOneSquad = action.payload;
		},
		setSelectedPlayerTwoSquad: (state: any, action: any) => {
			state.data.playerTwoSquad = action.payload;
		},
		setSelectedAllSquadPlayers: (state: any, action: any) => {
			state.data.allSquadPlayers = action.payload;
		},

		setPlayerOneDisabled: (state: any, action: any) => {
			state.data.playerOneDisabled = action.payload;
		},
		setPlayerTwoDisabled: (state: any, action: any) => {
			state.data.playerTwoDisabled = action.payload;
		},
		setPlayerTwoId: (state: any, action: any) => {
			state.data.playerTwoId = action.payload;
		},
		setPlayerOneId: (state: any, action: any) => {
			state.data.playerOneId = action.payload;
		},
		setAllData: (state: any, action: any) => {
			state.data.all_data = action.payload;
		},
		setTimer: (state: any, action: any) => {
			state.data.timer = action.payload;
		},
		setIsCompleted: (state: any, action: any) => {
			state.data.is_completed = action.payload;
		},
	},
});

export const {
	setSelectedSocket,
	setSelectedroomId,
	setSelectedPlayerId,
	setSelectedPlayerOneSquad,
	setSelectedPlayerTwoSquad,
	setSelectedAllSquadPlayers,
	setPlayerOneDisabled,
	setPlayerTwoDisabled,
	setPlayerOneId,
	setPlayerTwoId,
	setAllData,
	setTimer,
	setIsCompleted,
} = SocketDataSlice.actions;
export default SocketDataSlice.reducer;
