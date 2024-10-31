import { GameModes, initState } from "./constants.js";
import { deepCopy, debug } from "./utils/utils.js";
import { currentView } from "./constants.js";
import Socket from './services/Socket.js';

class State {
	constructor() {
		this.data = {};
		this.init();
	}

	async init() {
		const savedState = sessionStorage.getItem('appState');
		if (savedState) {
			this.data = JSON.parse(savedState);
			debug("State loaded from Session Storage", this);
			this.reconnect();
		} else {
			this.data = deepCopy(initState);
		}
	}

	reconnect() {
		if (this.data.gameData.gameId && (window.location.pathname === '/game' || window.location.pathname === '/online-game' || window.location.pathname == '/online-game-loading'))
		{
			debug("reconnecting to Socket");
			const currentMatch = this.get('tournament', 'matches')[this.get('tournament', 'currentMatchIndex')];
			const gameId = this.data.gameData.gameId;
			const oldUrl = this.get('gameSettings', 'mode') === GameModes.ONLINE ? 'online_game' : 'local_game';

			if (currentMatch.socket && currentMatch.socket.readyState === WebSocket.OPEN) {
				currentMatch.socket.close();
			}
			currentMatch.socket = new Socket(oldUrl, { gameId });
			currentMatch.socket.addEventListenersGame();
		}
	}

	get(...args) {
		let path = this.data;
		args.forEach(key => {
			if (path[key] === undefined) {
				console.error('Path not found');
			}
			path = path[key];
		});
		return path;
	}

	set(...args) {
		const value = deepCopy(args.pop());

		let path = this.data;
		const lastKey = args.pop();
		args.forEach(key => {
			if (path[key] === undefined) {
				console.error('Path not found');
			}
			path = path[key];
		});

		path[lastKey] = value;
		this.saveToSessionStorage();
		if (currentView.view && typeof currentView.view.update === 'function') {
			currentView.view.update();
		}
	}

	reset() {
		this.closeAllSockets();
		this.data = deepCopy(initState);
		this.saveToSessionStorage();
		debug("State reset", this);
	}

	closeAllSockets() {
		const matches = this.get('tournament', 'matches');
		if (!Array.isArray(matches)) { return; }
		const numberOfGames = this.get('tournament', 'numberOfGames');

		for (var i = 0; i < numberOfGames; i++) {
			if (matches && matches[i] && matches[i].socket instanceof Socket) {
				matches[i].socket.close();
			}
		}
	}

	updateState(newState) {
		const oldData = this.get("gameData");
		const newData = {
			...oldData,
			gameId: newState.game_id,
			phase: newState.phase,
			countdown: newState.countdown,
			player1Score: newState.player1_score,
			player2Score: newState.player2_score,
			player1Pos: newState.player1_pos,
			player2Pos: newState.player2_pos,
			player1Dir: newState.player1_dir,
			player2Dir: newState.player2_dir,
			player1Ready: newState.player1_ready,
			player2Ready: newState.player2_ready,
			ball: {
				x: newState.ball.x || 0,
				y: newState.ball.y || 0,
				velocity: {
					x: newState.ball_velocity.x || 0,
					y: newState.ball_velocity.y || 0,
				}
			}
		}
		//this.data.gameData = newData;
		this.set('gameData', newData);
	}

	initialiseGameData(gameData) {
		const oldData = this.get('gameData', 'constants');
		const newData = {
			...oldData,
			mapHeight: gameData.map_height,
			mapWidth: gameData.map_width,
			player1Username: gameData.player1_username,
			player2Username: gameData.player2_username,
			paddleHeight: gameData.paddle_height,
			paddleWidth: gameData.paddle_width,
			ballRadius: gameData.ball_radius,
			winner: ""
		};
		//this.data.gameData.constants = newData;
		this.set('gameData', 'constants', newData);
	}

	saveToSessionStorage() {
		sessionStorage.setItem('appState', JSON.stringify(this.data));
	}
}

export default new State();