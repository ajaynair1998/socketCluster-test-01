import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";
import SocketClusterClient from "socketcluster-client";

export interface IStore {
	socketStore: {
		data: {
			socket: SocketClusterClient.AGClientSocket | undefined | null;
			roomId: any;
			playerId: any;
			playerOneSquad: any[];
			playerTwoSquad: any[];
			allSquadPlayers: any[];
			playerOneDisabled: boolean;
			playerTwoDisabled: boolean;
			playerOneId: string;
			playerTwoId: string;
			timer: string;
			all_data: any;
			is_completed: boolean;
		};
	};
}
