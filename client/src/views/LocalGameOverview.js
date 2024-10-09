import Router from '../router.js';
import { standingsTableRow } from '../utils/utils.js';
import Socket from '../services/Socket.js';
import { PongGame } from '../components/PongGame.js';
import * as Cookies from '../services/cookies.js';
import State from '../State.js';

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
		console.log(State);
	}

	createTournament() {
		this.generateMatches();
		this.initPlayerStats();
		//this.update();
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
						completed: false
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

