import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import * as gameService from '../services/api/gameService.js';
import Router from '../router.js';
import State from '../State.js';
import Socket from '../services/Socket.js';

export class GameView {
	constructor() {
		this.gameSocket = null;
		this.game = null;
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;

		await this.getLocalGame();

		this.game = new PongGame(this.gameSocket);
		this.UIManager = new UIManager();
	}

	update() {
		this.game.update();
		this.UIManager.update();
	}

	async getLocalGame() {
		const response = await gameService.createLocalGame();
		if (!response.success) {
			throw new Error('Failed to create local game');
		}
		const data = response.data;
		this.initGameSocket(data.game_id);
	}

	initGameSocket(gameId) {
		this.gameSocket = new Socket('local_game', { gameId });
		this.gameSocket.addEventListenersGame();
		this.gameSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.game_data) {
				this.initialiseGameData(data.game_data);
			}
			if (data.game_state) {
				this.updateState(data.game_state);
			}
		});
	}

	initialiseGameData(gameData) {
		const oldSettings = State.get('gameSettings');
		const newSettings = {
			...oldSettings,
			ballRadius: gameData.ball_radius,
			map: {
				width: gameData.map_width,
				height: gameData.map_height
			},
			paddle: {
				width: gameData.paddle_width,
				height: gameData.paddle_height
			}
		};

		State.set('gameSettings', newSettings);
	}

	updateState(newState) {
		const oldData = State.get("gameData");
		console.log(newState);
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

		//state.data.gameData = newData;
		State.set('gameData', newData);
	}

}
