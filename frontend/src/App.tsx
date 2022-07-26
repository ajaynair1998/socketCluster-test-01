import React from "react";
import Lobby from "./pages/Lobby";
import PlayerOne from "./pages/Player-One";
import PlayerTwo from "./pages/Player-Two";
import { Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Lobby />} />
				<Route path="/player-one" element={<PlayerOne />} />
				<Route path="/player-two" element={<PlayerTwo />} />
			</Routes>
		</div>
	);
}

export default App;
