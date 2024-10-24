
import * as Cookies from './cookies.js';
import State from '../State.js';

export default class Socket {
	constructor(url, data) {
		this.url = url;
		this.socket = null;
		this.authToken = null;
		this.data = data;
		this.init();
		this.addEventListenersDebug();
	}

	init() {
		this.authToken = Cookies.getCookie("accessToken");
		const gameIndex = this.data.gameId ? this.data.gameId + '/' : '';
		this.socket = new WebSocket(`wss://localhost:8443/ws/${this.url}/${gameIndex}`);
	}

	send(data) {
		this.socket.send(data);
		console.log('Message sent: ', data)
	}

	addEventListenersMatchmaking() {
		this.socket.addEventListener('open', (event) => {
			console.log('Matchmaking WebSocket connection opened (Message Token Method)');
			this.send(JSON.stringify({
				action: 'join_game',
				token: `${this.authToken}`
			}));
		});
		this.socket.addEventListener('close', (event) => {
			console.log('Matchmaking WebSocket Closed');
		});
	}

	addEventListenersGame() {
		this.socket.addEventListener('open', (event) => {
			console.log('Game WebSocket connection opened (Message Token Method)');
			this.socket.send(JSON.stringify({
				action: 'authenticate',
				token: `${this.authToken}`
			}));
			this.socket.send(JSON.stringify({
				action: 'get_init_data'
			}));
		});
		this.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.game_data) {
				State.initialiseGameData(data.game_data);
			}
			if (data.game_state) {
				State.updateState(data.game_state);
			}
		});
		this.socket.addEventListener('close', (event) => {
			console.log('Game WebSocket Closed');
		});
	}

	addEventListenersDebug() {
		this.socket.addEventListener('message', (event) => {
			if (event.data.game_data) {
				console.log(event.data.game_data);
			}
		});

		this.socket.addEventListener('close', (event) => {
			if (event.wasClean) {
				console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.error('Connection died');
			}
		});

		this.socket.addEventListener('error', (error) => {
			console.error('WebSocket error:', error);
		});
	}

	close(code = 1000, reason = "Normal closure") {
		if (this.socket) {
			this.socket.close(code, reason);
			console.log(`WebSocket connection closed: ${reason}`);
		} else {
			console.log('WebSocket connection already closed or not initialized');
		}
	}
}