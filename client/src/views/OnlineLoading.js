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

		this.matchMakingSocket = new Socket('matchmaking', {});
		this.matchMakingSocket.addEventListenersMatchmaking();
		this.matchMakingSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data.type === 'game_joined') {
				this.matchMakingSocket.close();
				Cookies.setCookie("gameId", data.game_id, 24);
				console.log("Matchmaking Done");
				// window.history.pushState({}, "", "/game");
				// Router.handleLocationChange();
			}
		});
		this.initGameSocket(Cookies.getCookie("gameId"));
	}
	
	initGameSocket(gameId) {
		console.log("Init Game Socket Started");
		this.gameSocket = new Socket('live_game', { gameId });
		this.gameSocket.addEventListenersGame();
		// this.gameSocket.socket.addEventListener('message', (event) => {
		// 	const data = JSON.parse(event.data);
		// 	console.log(data);
		// });
		console.log("Init Game Socket Finished");
	}
}

