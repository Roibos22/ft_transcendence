import Router from '../router.js';
import { PongGame } from '../conponents_online/PongGame.js';
import * as Cookies from '../services/cookies.js';
import OnlineInputHandler from '../conponents_online/OnlineInputHandler.js';

export class OnlineGameView {
	constructor() {
		this.socket = null;
		this.inputHandler = null;
		this.game2d = null;
		this.game3d = null;
	}

	async init() {
		const content = await Router.loadTemplate('online-game');
		document.getElementById('app').innerHTML = content;
		// this.game2d = new PongGame();
		this.connectWebSocketWithMessageToken();
		this.inputHandler = new OnlineInputHandler(this.socket);
	}

	connectWebSocketWithMessageToken() {
		const authToken = Cookies.getCookie("accessToken");
		this.socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');

		this.socket.addEventListener('open', (event) => {
			console.log('WebSocket connection opened (Message Token Method)');

			this.socket.send(JSON.stringify({
				action: 'join_game',
				token: `${authToken}`
			}));
		});

		this.socket.addEventListener('message', (event) => {
			console.log('Message from server:', event.data);
		});

		this.socket.addEventListener('close', (event) => {
			if (event.wasClean) {
				console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.error('Connection died');
			}
		});

		this.socket.addEventListener('error', (error) => {
			console.error('WebSocket error (Message Token Method):', error);
		});
	}
}
