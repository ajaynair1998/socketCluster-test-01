import { createClient } from "redis";

const client = createClient();

(async (): Promise<any> => {
	try {
		client.on("error", (err) => console.log("Redis Client Error", err));
		await client.connect();
		console.log("\x1b[32m%s\x1b[0m", "Connected to Redis");
	} catch (err: any) {
		console.log("\x1b[31m%s\x1b[0m", "Failed to syncronize");
		console.log(err);
	}
})();
export { client as database };
