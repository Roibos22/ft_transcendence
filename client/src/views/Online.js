import Router from '../router.js';
import Socket from '../services/Socket.js';
import { UIManager } from '../components/UIManager.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';
import state from "../State.js";

export class OnlineGameView {
	constructor() {
		this.gameSocket = null;
		this.game = null
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;
		this.initGameSocket(Cookies.getCookie("gameId"));
		this.game = new PongGame(this.gameSocket);
		this.UIManager = new UIManager();
	}
	
	initGameSocket(gameId) {
		this.gameSocket = new Socket('live_game', { gameId });
		this.gameSocket.addEventListenersGame();
		this.gameSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.game_state) {
				this.updateState(data.game_state);
			}
		});
	}

	updateState(newState) {
		const oldData = state.get("gameData");

		var newData = {
			...oldData,
			gameId: newState.game_id,
			phase: newState.phase,
			countdown: newState.countdown,
			player1Pos: newState.player1_pos,
			player2Pos: newState.player2_pos,
			player1Ready: newState.player1_ready,
			player2Ready: newState.player2_ready,
			ball: {
				x: newState.ball.x || 0,
				y: newState.ball.y || 0,
					dx: newState.ball_dir.x || 0,
					dy: newState.ball_dir.y || 0,
			}
		}

		//state.data.gameData = newData;
		state.set('gameData', newData);
	}

	update() {
		this.UIManager.update();
		this.game.update();
	}
}

