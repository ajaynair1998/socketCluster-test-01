export interface IPlayer {
	name: string;
	id: string;
	points: number;
}

export interface IRoom {
	id: string;
	playerOneId: string;
	playerTwoId: string;
	playerOneSquad: { [key: string]: IPlayer };
	playerTwoSquad: { [key: string]: IPlayer };
	playersAvailable: { [key: string]: IPlayer };
	playerOneTurn: boolean;
	playerTwoTurn: boolean;
	timer: number;
	time_elapsed: any[];
	player_one_actions_available: number;
	player_two_actions_available: number;
	is_completed: boolean;
}

export interface IRooms {
	[key: string]: IRoom;
}
