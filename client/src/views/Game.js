import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import * as gameService from '../services/api/gameService.js';
import Router from '../router.js';
import State from '../State.js';
import Socket from '../services/Socket.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIManager = null;
	}

	async init() {
		console.log('GameView init called');
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;

		console.log('Game template loaded:', document.getElementById('app').innerHTML);

		await this.initializeGame();
		this.UIManager = new UIManager();

		console.log('Canvas in DOM after init:', document.getElementById('gameCanvas2D'));

	}


	async initializeGame() {
		console.log('Initializing game');
		const currentMatch = State.get('tournament', 'matches')[State.get('tournament', 'currentMatchIndex')];
		if (currentMatch && currentMatch.socket) {
			if (!PongGame.instance) {
				this.game = new PongGame(currentMatch.socket);
			} else {
				console.log('Using existing PongGame instance');
				this.game = PongGame.instance;
			}
		} else {
			console.error('No current match or socket found');
			// If no match is found, create a local game
			await this.getLocalGame();
		}
	}

	update() {
		if (this.game) {
			this.game.update();
		}
		if (this.UIManager) {
			this.UIManager.update();
		}
	}

	cleanup() {
		if (this.game) {
			this.game.cleanup();
			this.game = null;
		}
		if (this.UIManager) {
			// Assuming UIManager has a cleanup method
			this.UIManager.cleanup();
			this.UIManager = null;
		}
		PongGame.instance = null;  // Reset the PongGame instance
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
		const oldData = State.get('gameData', 'constants');
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

		State.set('gameData', 'constants', newData);
	}

	updateState(newState) {
		const oldData = State.get("gameData");
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

		State.set('gameData', newData);
	}
}