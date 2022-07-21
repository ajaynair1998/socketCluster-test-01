import SocketClusterClient from "socketcluster-client";

export const socket = SocketClusterClient.create({
	hostname: "localhost",
	port: 8000,
});
