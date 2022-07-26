import moment from "moment";
export const delay = (ms: number): Promise<any> =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const currentExactTime = (): any => {
	// let currentTime = moment().format("h:mm:sssssssss:a");
	let currentTime = new Date();

	return (
		`${currentTime.getSeconds()} seconds ` +
		`${currentTime.getMilliseconds()} ms`
	);
};

export const roomId = "room-one";
