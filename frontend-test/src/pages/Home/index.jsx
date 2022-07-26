import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { socket } from "../../configs/Socket";

const HomePage = () => {
	const [channel, setChannel] = useState(null);
	const [transmittedData, setTransmittedData] = useState(null);

	useEffect(() => {
		sendDataOnInitialisation();
	}, []);

	useEffect(() => {}, [channel]);

	useEffect(() => {
		console.log(
			"🚀 ~ file: index.jsx ~ line 8 ~ HomePage ~ transmittedData",
			transmittedData
		);
	}, [transmittedData]);

	const sendDataOnInitialisation = async () => {
		try {
			(async () => {
				let channel = socket.subscribe("channel-one");
				for await (let data of channel) {
					console.log("🚀 ~ file: index.jsx ~ line 33 ~ forawait ~ data", data);
					// ... Handle channel data.
				}
			})();
			let data = await socket.invoke("join-game", "something");
			console.log(
				"🚀 ~ file: index.jsx ~ line 26 ~ sendDataOnInitialisation ~ data",
				data
			);
			setChannel(channel);
		} catch (err) {
			console.log(err);
		}
	};

	return <div>HomePage</div>;
};

export default HomePage;
