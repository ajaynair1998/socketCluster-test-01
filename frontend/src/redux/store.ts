import { configureStore } from "@reduxjs/toolkit";
import SocketDataReducer from "./reducers/SocketDataReducer";

export default configureStore({
	reducer: {
		socketStore: SocketDataReducer,
	},
});
