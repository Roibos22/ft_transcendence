
import * as Cookies from './cookies.js';
import State from '../State.js';
import { DEBUG, debug } from '../utils/utils.js'

export default class Socket {
	constructor(url, data) {
		this.url = url;
		this.socket = null;
		this.authToken = null;
		this.data = data;
		this.init();
		if (DEBUG)
			this.addEventListenersDebug();
	}

	init() {
		this.authToken = Cookies.getCookie("accessToken");
		const gameIndex = this.data.gameId ? this.data.gameId + '/' : '';
		this.socket = new WebSocket(`wss://${window.location.host}/ws/${this.url}/${gameIndex}`);
	}

	send(data) {
		this.socket.send(data);
	}

	isOpen() {
		return this.socket && this.socket.readyState === WebSocket.OPEN;
	}

	addEventListenersMatchmaking() {
		this.socket.addEventListener('open', (event) => {
			debug('Matchmaking WebSocket connection opened (Message Token Method)');
			this.send(JSON.stringify({
				action: 'join_game',
				token: `${this.authToken}`
			}));
		});
		this.socket.addEventListener('close', (event) => {
			debug('Matchmaking WebSocket Closed');
		});
	}

	addEventListenersGame() {
		this.socket.addEventListener('open', (event) => {
			debug('Game WebSocket connection opened (Message Token Method)');
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
			debug('Game WebSocket Closed');
		});
	}

	addEventListenersDebug() {
		this.socket.addEventListener('message', (event) => {
			if (event.data.game_data) {
				debug(event.data.game_data);
			}
		});

		this.socket.addEventListener('close', (event) => {
			if (event.wasClean) {
				debug(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
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
			debug(`WebSocket connection closed: ${reason}`);
		} else {
			debug('WebSocket connection already closed or not initialized');
		}
	}
}