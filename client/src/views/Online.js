import Router from '../router.js';
import OnlineInputHandler from '../conponents_online/OnlineInputHandler.js';
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
		const content = await Router.loadTemplate('online-game');
		document.getElementById('app').innerHTML = content;
		this.game = new PongGame();
		this.UIManager = new UIManager();
		this.initGameSocket(Cookies.getCookie("gameId"));
		this.inputHandler = new OnlineInputHandler(this.gameSocket);
		console.log("Online Game initialized");
	}
	
	initGameSocket(gameId) {
		this.gameSocket = new Socket('live_game', { gameId });
		this.gameSocket.addEventListenersGame();

		// Add message event listener
		this.gameSocket.socket.addEventListener('message', (event) => {
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

		// make object
		// const oldData = state.get("gameData");
		// const newData = {
		// 	...oldData,
		// 	phase: gameState.phase,
		// 	player1Pos: gameState.player1Pos,
		// 	player2Pos: gameState.player2Pos,
		// 	countdown: gameState.countdown,
		// 	// ball: {
		// 	// 	x: gameState.ball.x,
		// 	// 	y: 0,
		// 	// }
		// }

		//state.set('gameData', newData);
		state.set('gameData', 'player1Pos', newState.player1Pos);
		state.set('gameData', 'player2Pos', newState.player2Pos);
		// state.set('gameData', 'countdown', gameState.countdown);
		//state.set('gameData', 'ball', 'x', gameState.ball.position.x);
		//state.set('gameData', 'ball', 'y', gameState.ball.position.y);

		//if (!state.data.player1) state.set('player1', {});
		//if (!state.data.player2) state.set('player2', {});

		// state.set('player1', 'side', gameState.player_1.side);
		// state.set('player1', 'size', gameState.player_1.size);
		// state.set('player2', 'side', gameState.player_2.side);
		// state.set('player2', 'size', gameState.player_2.size);

		//console.log("Updated state:", state.data);
	}

	update() {
		this.UIManager.update();
		this.game.update();
	}

}

