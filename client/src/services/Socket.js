
import * as Cookies from './cookies.js';

export default class Socket {
    constructor(url, data) {
        this.url = url;
        this.socket = null;
        this.authToken = null;
        this.data = data;
        this.init();
        this.addEventListeners();
    }

    init() {
        this.authToken = Cookies.getCookie("accessToken");
        this.socket = new WebSocket(`ws://localhost:8000/ws/${this.url}/${this.data.gameId || ''}`);
    }

    send(data) {
        this.socket.send(data);
    }

    addEventListeners() {
        this.socket.addEventListener('open', (event) => {
            console.log('WebSocket connection opened (Message Token Method)');
            this.socket.send(JSON.stringify({
                action: 'join_game',
                token: `${this.authToken}`
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
            console.error('WebSocket error:', error);
        });
    }
}