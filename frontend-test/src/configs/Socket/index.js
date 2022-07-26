import SocketClusterClient from "socketcluster-client";
const roomId = "room-one";
const userId = "player-one";

export const socket = SocketClusterClient.create({
	hostname: "localhost",
	port: 8000,
});
