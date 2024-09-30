import Router from '../router.js';
import Socket from '../services/Socket.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';

export class OnlineGameLoadingView {
	constructor() {
		this.matchMakingSocket = null;
		this.gameSocket = null;
		//this.game = null
	}

	async init() {
		const content = await Router.loadTemplate('online-game-loading');
		document.getElementById('app').innerHTML = content;
		//const canvas = document.getElementById('gameCanvas');
		//this.game2d = new PongGame(canvas);
		this.matchMakingSocket = new Socket('matchmaking', {});
		this.matchMakingSocket.addEventListenersMatchmaking();
		this.matchMakingSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'game_joined') {
				this.matchMakingSocket.socket.close();
				Cookies.setCookie("gameId", data.game_id, 24);
				window.history.pushState({}, "", "/online-game");
				Router.handleLocationChange();
				//this.initGameSocket(data.game_id);
			}
		});
	}
	
	initGameSocket(gameId) {
		this.gameSocket = new Socket('live_game', { gameId });
		this.gameSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			// if (data.type === 'game_update') {
				// 	this.game2d.update(data);
				// }
				console.log(data);
			});
	}
}

