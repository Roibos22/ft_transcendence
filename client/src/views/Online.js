import Router from '../router.js';
import OnlineInputHandler from '../conponents_online/OnlineInputHandler.js';
import Socket from '../services/Socket.js';
import { UIManager } from '../components/UIManager.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';
import state from "../State.js";

export class OnlineGameView {
	constructor() {
		this.game = null
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;
		this.game = new PongGame();
		this.UIManager = new UIManager();
		this.initGameSocket(Cookies.getCookie("gameId"));
		this.inputHandler = new OnlineInputHandler(this.game);
		console.log("Online Game initialized");
	}
	
	initGameSocket(gameId) {
		this.game.gameSocket = new Socket('live_game', { gameId });
		this.game.gameSocket.addEventListenersGame();
		// Add message event listener
		state.reset();
		console.log(state.data);
		this.game.gameSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			//console.log("Game socket received message:", data);
			// Handle game updates here
			//console.log(data);
			if (data.game_state) {
				this.updateState(data.game_state);
			}
		});
	}

	updateState(newState) {
		const oldData = state.get("gameData");
		var newData = {
			...oldData,
			phase: newState.phase,
			countdown: newState.countdown,
		}

		if (newData.phase === "running") {
			newData = {
				...newData,
				player1Pos: newState.player1_pos,
				player2Pos: newState.player2_pos,
				ball: {
					x: newState.ball.x || 0,
					y: newState.ball.y || 0,
					dx: newState.ball_dir.x || 0,
					dy: newState.ball_dir.y || 0,
				}
			}
		}

		state.data.gameData = newData;
	}

	update() {
		this.UIManager.update();
		this.game.update();
	}
}

