import Router from '../router.js';
import { standingsTableRow } from '../utils/utils.js';
import Socket from '../services/Socket.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';
import State from '../State.js';
import { Tournament } from '../components/Tournament.js';
import * as gameService from '../services/api/gameService.js';


export class LocalGameOverview {
	constructor() {
		this.game = null
		this.content = {
			fixtures: null,
			standings: null,
			standingsTable: null,
		}
	}

	async init() {
		const content = await Router.loadTemplate('local-game-overview');
		document.getElementById('app').innerHTML = content;

		this.content.fixtures = document.getElementById('fixtures');
		this.content.standings = document.getElementById('standings');
		this.content.standingsTable = document.getElementById('standingsTable');

		this.createTournament();
		//this.tournament = new Tournament();
		console.log(State);
	}

	createTournament() {
		this.generateMatches();
		this.initPlayerStats();
		//this.update();
		this.setupNextMatch();
	}

	setupNextMatch() {
		const tournament = State.get('tournament');
		const currentMatchIndex = tournament.currentMatchIndex;
		const matches = tournament.matches;

		if (currentMatchIndex >= matches.length) {
			console.log("Tournament completed");
			return;
		}

		const currentMatch = matches[currentMatchIndex];

		// CLOSE SOCKET OF DONE GAMES
		// if (this.currentSocket) {
		// 	this.currentSocket.close();
		// }
		this.getLocalGame(currentMatch);


	}

	async getLocalGame(currentMatch) {
		const response = await gameService.createLocalGame();
		if (!response.success) {
			throw new Error('Failed to create local game');
		}
		const data = response.data;
		this.initGameSocket(currentMatch, data.game_id);
	}

	initGameSocket(currentMatch, gameId) {
		currentMatch.socket = new Socket('local_game', { gameId });
		currentMatch.socket.addEventListenersGame();
		currentMatch.socket.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.game_data) {
				this.initialiseGameData(data.game_data);
			}
			if (data.game_state) {
				this.updateState(data.game_state);
			}
		});
	}

	initialiseGameData(gameData) {
		const oldData = State.get('gameData', 'constants');
		console.log("gameData", gameData);
		const newData = {
			...oldData,
			mapHeight: gameData.map_height,
			mapWidth: gameData.map_width,
			player1Username: gameData.player1_username,
			player2Username: gameData.player2_username,
			paddleHeight: gameData.paddle_height,
			paddleWidth: gameData.paddle_width,
			ballRadius: gameData.ball_radius,
			winner: ""
		};

		State.set('gameData', 'constants', newData);
	}

	updateState(newState) {
		const oldData = State.get("gameData");
		const newData = {
			...oldData,
			gameId: newState.game_id,
			phase: newState.phase,
			countdown: newState.countdown,
			player1Score: newState.player1_score,
			player2Score: newState.player2_score,
			player1Pos: newState.player1_pos,
			player2Pos: newState.player2_pos,
			player1Dir: newState.player1_dir,
			player2Dir: newState.player2_dir,
			player1Ready: newState.player1_ready,
			player2Ready: newState.player2_ready,
			ball: {
				x: newState.ball.x || 0,
				y: newState.ball.y || 0,
				dx: newState.ball_dir.x || 0,
				dy: newState.ball_dir.y || 0,
				speed: newState.ball_speed || 0
			}
		}

		State.set('gameData', newData);
	}

	initPlayerStats() {
		var players = State.get("tournament", "players");
	
		players = players.map(player => ({
			...player,
			rank: 0,
			wins: 0,
			losses: 0,
			points: 0
		}));
	
		State.set("tournament", "players", players);
	}

	generateMatches() {
		const matches = [];
		const tournament = State.get('tournament');

		for (let i = 0; i < tournament.numberOfGames; i++) {
			for (let j = 0; j < tournament.players.length; j++) {
				for (let k = j + 1; k < tournament.players.length; k++) {
					matches.push({
						players: [
							{ ...tournament.players[j], score: 0 },
							{ ...tournament.players[k], score: 0 }
						],
						completed: false,
						socket: null,
					});
				}
			}
		}

		State.set('tournament', 'matches', matches);
	}
	
	update() {
		this.updateMatchList();
		this.updateStandings();
	}

	updateStandings() {
		var standings = this.getStandings();
		//State.set("tournament", "standings", standings);
		var tableRows = standings.map(playerStats => standingsTableRow(playerStats)).join('');
		this.content.standingsTable.innerHTML = `${tableRows}`;
	}

	getStandings() {
		return State.get('tournament', 'players')
			.sort((a, b) => b.points - a.points || (b.wins - b.losses) - (a.wins - a.losses))
			.map((player, index) => ({
				rank: index + 1,
				name: player.name,
				wins: player.wins,
				losses: player.losses,
				points: player.points
			}));
	}

	updateMatchList() {
		const tournament = State.get('tournament');
		const matchesList = tournament.matches.map((match, index) => {
			const player1 = match.players[0].name;
			const player2 = match.players[1].name;
			let matchClass = 'list-group-item';
			let matchContent = '';
	
			if (match.completed) {
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<span>${player1} vs ${player2}</span>
						<span class="badge bg-secondary ms-3 fs-6">${match.players[0].score}:${match.players[1].score}</span>
					</div>`;
			} else if (index === tournament.currentMatchIndex) {
				matchClass += ' active';
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<strong>${player1} vs ${player2}</strong>
						<span class="badge bg-primary ms-3 fs-6">${match.players[0].score}:${match.players[1].score}</span>
					</div>`;
			} else {
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<span>${player1} vs ${player2}</span>
						<span class="invisible">Placeholder</span>
					</div>`;
			}
			return `<li class="${matchClass}">${matchContent}</li>`;
		}).join('');
	
		this.content.fixtures.innerHTML = `
			<div class="card">
				<div class="card-header bg-dark text-white text-center">
					<h5 class="mb-0">Matches</h5>
				</div>
				<ul class="list-group list-group-flush">
					${matchesList}
				</ul>
			</div>
		`;
	}
}

