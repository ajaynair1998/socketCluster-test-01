import http from "http";
import eetase from "eetase";
import socketClusterServer from "socketcluster-server";
import express from "express";
import serveStatic from "serve-static";
import path from "path";
import morgan from "morgan";
import { v4 } from "uuid";
import sccBrokerClient from "scc-broker-client";
import { SCCBrokerClientOptions } from "scc-broker-client";
import socketController from "./controllers/SocketConnectionController";

const ENVIRONMENT = process.env.ENV || "dev";
const SOCKETCLUSTER_PORT = process.env.SOCKETCLUSTER_PORT || 8000;
const SOCKETCLUSTER_WS_ENGINE = process.env.SOCKETCLUSTER_WS_ENGINE || "ws";
const SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT =
	Number(process.env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000;
const SOCKETCLUSTER_LOG_LEVEL = process.env.SOCKETCLUSTER_LOG_LEVEL || 2;

const SCC_INSTANCE_ID = v4();
const SCC_STATE_SERVER_HOST = process.env.SCC_STATE_SERVER_HOST || null;
const SCC_STATE_SERVER_PORT = process.env.SCC_STATE_SERVER_PORT || undefined;
const SCC_MAPPING_ENGINE = process.env.SCC_MAPPING_ENGINE || undefined;
const SCC_CLIENT_POOL_SIZE = process.env.SCC_CLIENT_POOL_SIZE || undefined;
const SCC_AUTH_KEY = process.env.SCC_AUTH_KEY || undefined;
const SCC_INSTANCE_IP = process.env.SCC_INSTANCE_IP || undefined;
const SCC_INSTANCE_IP_FAMILY = process.env.SCC_INSTANCE_IP_FAMILY || undefined;
const SCC_STATE_SERVER_CONNECT_TIMEOUT =
	Number(process.env.SCC_STATE_SERVER_CONNECT_TIMEOUT) || undefined;
const SCC_STATE_SERVER_ACK_TIMEOUT =
	Number(process.env.SCC_STATE_SERVER_ACK_TIMEOUT) || undefined;
const SCC_STATE_SERVER_RECONNECT_RANDOMNESS =
	Number(process.env.SCC_STATE_SERVER_RECONNECT_RANDOMNESS) || undefined;
const SCC_PUB_SUB_BATCH_DURATION =
	Number(process.env.SCC_PUB_SUB_BATCH_DURATION) || undefined;
const SCC_BROKER_RETRY_DELAY =
	Number(process.env.SCC_BROKER_RETRY_DELAY) || undefined;

let agOptions = {};

if (process.env.SOCKETCLUSTER_OPTIONS) {
	let envOptions = JSON.parse(process.env.SOCKETCLUSTER_OPTIONS);
	Object.assign(agOptions, envOptions);
}

let httpServer = eetase(http.createServer());
let agServer = socketClusterServer.attach(httpServer, agOptions);

let expressApp = express();
if (ENVIRONMENT === "dev") {
	// Log every HTTP request. See https://github.com/expressjs/morgan for other
	// available formats.
	expressApp.use(morgan("dev"));
}
expressApp.use(serveStatic(path.resolve(__dirname, "public")));

// Add GET /health-check express route
expressApp.get("/health-check", (req, res) => {
	res.status(200).send("OK");
});

// HTTP request handling loop.
(async () => {
	for await (let requestData of httpServer.listener("request")) {
		expressApp.apply(null, requestData);
	}
})();

// SocketCluster/WebSocket connection handling loop.
(async () => {
	for await (let { socket } of agServer.listener("connection")) {
		// Handle socket connection.
	}
})();

httpServer.listen(SOCKETCLUSTER_PORT);

if (SOCKETCLUSTER_LOG_LEVEL >= 1) {
	(async () => {
		for await (let { error } of agServer.listener("error")) {
			console.error(error);
		}
	})();
}

if (SOCKETCLUSTER_LOG_LEVEL >= 2) {
	console.log(
		`   ${colorText("[Active]", 32)} SocketCluster worker with PID ${
			process.pid
		} is listening on port ${SOCKETCLUSTER_PORT}`
	);

	(async () => {
		for await (let { warning } of agServer.listener("warning")) {
			console.warn(warning);
		}
	})();
}

function colorText(message: string, color: number) {
	if (color) {
		return `\x1b[${color}m${message}\x1b[0m`;
	}
	return message;
}

if (SCC_STATE_SERVER_HOST) {
	// Setup broker client to connect to SCC.
	let sccClient = sccBrokerClient.attach(agServer.brokerEngine, {
		instanceId: SCC_INSTANCE_ID,
		instancePort: Number(SOCKETCLUSTER_PORT),
		instanceIp: SCC_INSTANCE_IP,
		instanceIpFamily: SCC_INSTANCE_IP_FAMILY,
		pubSubBatchDuration: SCC_PUB_SUB_BATCH_DURATION,
		stateServerHost: SCC_STATE_SERVER_HOST,
		stateServerPort: Number(SCC_STATE_SERVER_PORT),
		// @ts-ignore
		mappingEngine: SCC_MAPPING_ENGINE,
		clientPoolSize: Number(SCC_CLIENT_POOL_SIZE),
		authKey: SCC_AUTH_KEY,
		stateServerConnectTimeout: SCC_STATE_SERVER_CONNECT_TIMEOUT,
		stateServerAckTimeout: SCC_STATE_SERVER_ACK_TIMEOUT,
		stateServerReconnectRandomness: SCC_STATE_SERVER_RECONNECT_RANDOMNESS,
		brokerRetryDelay: SCC_BROKER_RETRY_DELAY,
	});

	if (SOCKETCLUSTER_LOG_LEVEL >= 1) {
		(async () => {
			for await (let { error } of sccClient.listener("error")) {
				error.name = "SCCError";
				console.error(error);
			}
		})();
	}
}

(async () => {
	for await (let { socket } of agServer.listener("connection")) {
		socketController.main(socket, agServer);
	}
})();
