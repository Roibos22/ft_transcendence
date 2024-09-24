import state from '../State.js';
import { standingsTableRow } from '../utils/utils.js';
import { Tournament } from './Tournament.js';

export class UIManager {
	constructor() {
		this.content = {
			displayToggle: null,
			scoreCard: {
				player1Name: null,
				player2Name: null,
				player1Score: null,
				player2Score: null,
			},
			fixtures: null,
			standings: null,
			standingsTable: null,
		}
		this.init();
	}

	init() {
		this.content.displayToggle = document.getElementById('viewToggle');
		this.content.displayToggle.addEventListener('change', () => {
			state.set('gameSettings', 'displayType', this.content.displayToggle.checked ? '3D' : '2D');
		});

		this.content.scoreCard = {
			player1Name: document.getElementById('player1Name'),
			player2Name: document.getElementById('player2Name'),
			player1Score: document.getElementById('player1Score'),
			player2Score: document.getElementById('player2Score'),
		};
		this.content.fixtures = document.getElementById('fixtures');
		this.content.standings = document.getElementById('standings');
		this.content.standingsTable = document.getElementById('standingsTable');
		this.update();
	}

	update() {
		this.updateScoreCard()
		if (state.get('tournament')) {
			this.updateMatchList();
			this.updateTable();
		} else {
			this.hideTournamentInfo();
		}
	}

	hideTournamentInfo() {
		this.content.fixtures.style.display = 'none';
		this.content.standings.style.display = 'none';
	}

	updateScoreCard() {
		const { player1Name, player2Name, player1Score, player2Score } = state.get('currentMatch');
	
		this.content.scoreCard.player1Name.innerHTML = player1Name;
		this.content.scoreCard.player2Name.innerHTML = player2Name;
		this.content.scoreCard.player1Score.innerHTML = player1Score;
		this.content.scoreCard.player2Score.innerHTML = player2Score;
	}

	updateMatchList() {
		this.content.fixtures.style.display = 'block';
		const tournament = state.get('tournament');
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
	
		this.view.tournamentInfoMatches.innerHTML = `
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

	updateTable() {
		this.content.standings.style.display = 'block';
		const standings = Tournament.getStandings();
		const tableEntries = standings.map(playerStats => standingsTableRow(playerStats))
	
		this.standingsTable.innerHTML = `${tableEntries.join('')}`;
	}

}