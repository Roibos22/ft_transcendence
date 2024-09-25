
import * as Cookies from './cookies.js';

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
			console.log('WebSocket connection opened (Message Token Method)');
			this.socket.send(JSON.stringify({
				action: 'join_game',
				token: `${this.authToken}`
			}));
		});
	}

	addEventListenersGame() {
		this.socket.addEventListener('open', (event) => {
			console.log('WebSocket connection opened (Message Token Method)');
			this.socket.send(JSON.stringify({
				action: 'authenticate',
				token: `${this.authToken}`
			}));
		});
		this.socket.addEventListener('open', () => {
			console.log("Game socket opened, sending player_ready");
			setTimeout(() => {
				console.log("Sending player_ready message");
				this.socket.send(JSON.stringify({
					action: 'player_ready'
				}));
			}, 1000);
		});
	}

	addEventListenersDebug() {
		this.socket.addEventListener('message', (event) => {
			//console.log('Message from server:', event.data);
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
}