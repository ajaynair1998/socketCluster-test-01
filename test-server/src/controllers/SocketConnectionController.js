const { agServer } = require("../../server");

module.exports = {
	main: async (socket, agServer) => {
		try {
			let exchange = agServer.exchange;
			let clients = agServer.clients;

			console.log(
				"🚀 ~ file: SocketConnectionController.js ~ line 8 ~ main: ~ clients",
				Object.keys(clients)
			);
			(async () => {
				for await (let rpc of socket.procedure("join-game")) {
					console.log(rpc.data);
					let value = await socket.isSubscribed("channel-one");
					console.log(
						"🚀 ~ file: SocketConnectionController.js ~ line 17 ~ forawait ~ value",
						value
					);
					agServer.exchange.transmitPublish("channel-one", "This is some data");
					rpc.end("success");
				}
			})();
		} catch (err) {
			console.log(err);
		}
	},
};
