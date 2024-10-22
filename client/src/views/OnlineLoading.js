import Router from '../router.js';
import Socket from '../services/Socket.js';
import { PongGame } from '../components/PongGame.js';
import State from '../State.js';
import * as Cookies from '../services/cookies.js';

export class OnlineGameLoadingView {
	constructor() {
		this.matchMakingSocket = null;
		this.gameSocket = null;
	}

	async init() {
		const content = await Router.loadTemplate('online-game-loading');
		document.getElementById('app').innerHTML = content;

		this.createTournament();
		this.matchMakingSocket = new Socket('matchmaking', {});
		this.matchMakingSocket.addEventListenersMatchmaking();
		this.matchMakingSocket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			console.log("Matchmaking Socket Message received", data);
			if (data.type === 'game_joined') {
				this.matchMakingSocket.close();
				Cookies.setCookie("gameId", data.game_id, 24);
				console.log("Matchmaking Done");
				this.initGameSocket(Cookies.getCookie("gameId"));
				window.history.pushState({}, "", "/online-game");
				Router.handleLocationChange();
			}
		});
	}

	createTournament() {
		const tournament = State.get('tournament');

		const players = [];
		players.push({
			name: "Player 1",
			rank: 0,
			wins: 0,
			losses: 0,
			points: 0
		});
		players.push({
			name: "Player 2",
			rank: 0,
			wins: 0,
			losses: 0,
			points: 0
		});
		State.set("tournament", "players", players);

		// create one Match only
		const matches = [];
		matches.push({
			players: [
				// TODO
				// { name: tournament.players[j].name, score: 0 },
				// { name: tournament.players[k].name, score: 0 }
				{ name: "Player 1", score: 0 },
				{ name: "Player 2", score: 0 }
			],
			completed: false,
			socket: null,
		});
		State.set('tournament', 'matches', matches);

		// setup next match
		console.log("State", State);
	}
	
	initGameSocket(gameId) {
		const matches = State.get('tournament', 'matches');

		matches[0].socket = new Socket('online_game', { gameId });
		matches[0].socket.addEventListenersGame();

		matches[0].players[0].name = "Updated Name";
		State.set('tournament', 'mathches', matches);
	}

	update() {

	}
}

