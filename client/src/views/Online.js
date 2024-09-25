import Router from '../router.js';
import OnlineInputHandler from '../conponents_online/OnlineInputHandler.js';
import Socket from '../services/Socket.js';
import { UIManager } from '../components/UIManager.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';
import state from "../State.js";
import { GamePhases } from "../constants.js";


export class OnlineGameView {
	constructor() {
		this.gameSocket = null;
		this.game = null
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
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
		state.reset();
		console.log(state.data);
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
		//console.log("BEFORE: ", state.data);
		//console.log("newState: ", newState);
		const oldData = state.get("gameData");
		//console.log("oldData: ", oldData);
		var newData = {
			...oldData,
			phase: newState.phase,
			countdown: newState.countdown,
		}
		// console.log("newData: ", newData);

		if (newData.phase === "running") {
			newData = {
				...newData,
				player1Pos: newState.player1Pos,
				player2Pos: newState.player2Pos,
				ball: {
					x: newState.ball.position.x || 0,
					y: newState.ball.position.y || 0
				}
			}
			//console.log("newData2: ", newData);
		}

		//console.log("BEFORE: ", JSON.parse(JSON.stringify(state.data)));
		state.set('gameData', newData);
		//console.log("UPDATED STATE: ", state.data);
		//console.log("Direct access: ", state.get("gameData"));

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

