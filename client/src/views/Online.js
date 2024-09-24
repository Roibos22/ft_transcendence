import Router from '../router.js';
import OnlineInputHandler from '../conponents_online/OnlineInputHandler.js';
import Socket from '../services/Socket.js';
import { UIManager } from '../components/UIManager.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';

export class OnlineGameView {
	constructor() {
		this.gameSocket = null;
		this.game = null
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('online-game');
		document.getElementById('app').innerHTML = content;
		this.game2d = new PongGame();
		this.UIManager = new UIManager();
		this.initGameSocket(Cookies.getCookie("gameId"));
		this.inputHandler = new OnlineInputHandler(this.gameSocket);
		console.log("Online Game initialized");
	}
	
	initGameSocket(gameId) {
		this.gameSocket = new Socket('live_game', { gameId });
		
		// Add custom event listeners
		this.gameSocket.addEventListenersGame();
		
		// Add our custom 'open' event listener


		// Add message event listener
		this.gameSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			//console.log("Game socket received message:", data);
			// Handle game updates here
			// if (data.type === 'game_update') {
			//     this.game2d.update(data);
			// }
		});
	}

	update() {
		this.UIManager.update();
	}

	update() {
		this.UIManager.update();
	}
}

