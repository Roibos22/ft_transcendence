import { initState } from "./constants.js";
import { deepCopy } from "./utils/utils.js";
import { currentView } from "./constants.js";

class State {
	constructor() {
		this.data = {};
		this.init();
	}

	async init() {
		this.data = deepCopy(initState);
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
		currentView.view.update();
	}

	reset() {
		this.init();
		console.log("State reseted", this.data);
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
				dx: newState.ball_dir.x || 0,
				dy: newState.ball_dir.y || 0,
				speed: newState.ball_speed || 0
			}
		}
		this.set('gameData', newData);
	}

	initialiseGameData(gameData) {
		const oldData = this.get('gameData', 'constants');
		console.log("gameData", gameData);
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

		this.set('gameData', 'constants', newData);
	}
}

export default new State();