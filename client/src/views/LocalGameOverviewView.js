import Router from '../Router.js';
import { standingsTableRow } from '../utils/utils.js';
import Socket from '../services/Socket.js';
import State from '../State.js';
import * as gameService from '../services/api/gameService.js';
import * as Utils from '../utils/utils.js';


export class LocalGameOverviewView {
	constructor() {
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
		this.content.nextMatchButton = document.getElementById('goToNextMatch');
		this.content.tournamentInfoText = document.getElementById('tournamentInfoText');
		this.content.finishTournamentButton = document.getElementById('finishTournament');

		const tournament = State.get('tournament');
		if (!tournament || !tournament.matches || tournament.matches.length === 0) {
			this.createTournament();
		} else if (!tournament.completed) {
			this.setupNextMatch();
		}

		this.update();
	}

	createTournament() {
		Utils.generateMatches();
		Utils.initPlayerStats();
		this.setupNextMatch();
	}

	setupNextMatch() {
		const tournament = State.get('tournament');
		const currentMatchIndex = tournament.currentMatchIndex;
		const currentMatch = tournament.matches[currentMatchIndex];
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
	}

	update() {
		this.overwritePlayerNames();
		this.updateTournamentInfo();
		this.updateStandings();
		this.updateMatchList();
	}


	// TODO PROTECT
	overwritePlayerNames() {
		State.data.gameData.constants.player2Username = State.get('tournament', 'matches')[State.get('tournament', 'currentMatchIndex')].players[1].name;
	}

	updateTournamentInfo() {
		const tournament = State.get('tournament');

		if (!State.get('tournament', 'completed')) {
			const nextMatch = tournament.matches[tournament.currentMatchIndex];
			this.content.tournamentInfoText.textContent = `${nextMatch.players[0].name} vs ${nextMatch.players[1].name}`;
		} else {
			this.content.nextMatchButton.style.display = 'none';
			this.content.finishTournamentButton.style.display = 'block';
			this.content.tournamentInfoText.textContent = `Torunament Completed!`;
		}
	}
	
	updateStandings() {
		var standings = State.get('tournament', 'players')
			.sort((a, b) => b.points - a.points || (b.wins - b.losses) - (a.wins - a.losses))
			.map((player, index) => ({
				rank: index + 1,
				name: player.name,
				wins: player.wins,
				losses: player.losses,
				points: player.points
			}));

		var tableRows = standings.map(playerStats => standingsTableRow(playerStats)).join('');
		this.content.standingsTable.innerHTML = `${tableRows}`;
	}

	updateMatchList() {
		const tournament = State.get('tournament');
		const matchesList = tournament.matches.map((match, index) => {
			const player1 = match.players[0].name;
			const player2 = match.players[1].name;
			let matchClass = 'list-group-item';
			let matchStyle = '';
			let matchContent = '';
	
			if (match.completed) {
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<span>${player1} vs ${player2}</span>
						<span class="badge bg-secondary ms-3 fs-6">${match.players[0].score}:${match.players[1].score}</span>
					</div>`;
			} else if (index === tournament.currentMatchIndex) {
				matchStyle += 'background-color: #f2f2f2;';
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<strong>${player1} vs ${player2}</strong>
					</div>`;
			} else {
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<span>${player1} vs ${player2}</span>
						<span class="invisible">Placeholder</span>
					</div>`;
			}
			return `<li class="${matchClass}" style="${matchStyle}">${matchContent}</li>`;
		}).join('');
	
		this.content.fixtures.innerHTML = `
			<div class="card">
				<div class="card-header text-center rounded-top" style="background-color: #4CAF50;">
					<h5 class="mb-0 fw-bold">Matches</h5>
				</div>
				<ul class="list-group list-group-flush">
					${matchesList}
				</ul>
			</div>
		`;
	}
}

