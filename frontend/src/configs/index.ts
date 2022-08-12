import { Location } from "react-router-dom";
import { Manager, io } from "socket.io-client";
import SocketClusterClient from "socketcluster-client";

export const password = "password";
export const roomId = "room-one";
export const userId = "player-one";
export const ip = [
	"localhost",
	"13.250.106.183",
	"internet-facing-371961340.ap-southeast-1.elb.amazonaws.com",
];
export const createSocket = (room?: string) => {
	try {
		const socket = io(`http://localhost:5050/rooms`, {});

		return socket;
	} catch (err) {
		console.log(err);
	}
};

export const socketClusterSocket = SocketClusterClient.create({
	hostname: ip[2],
	port: 80,
});

export interface IState extends Omit<Location, "state"> {
	state: {
		roomId: string;
	};
}
