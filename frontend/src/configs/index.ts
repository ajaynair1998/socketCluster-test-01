import { Location } from "react-router-dom";
import { Manager, io } from "socket.io-client";
import SocketClusterClient from "socketcluster-client";

export const password = "password";
export const roomId = "room-one";
export const userId = "player-one";
export const createSocket = (room?: string) => {
	try {
		const socket = io(`http://localhost:5050/rooms`, {});

		return socket;
	} catch (err) {
		console.log(err);
	}
};

export const socketClusterSocket = SocketClusterClient.create({
	hostname: "localhost",
	port: 8000,
});

export interface IState extends Omit<Location, "state"> {
	state: {
		roomId: string;
	};
}
