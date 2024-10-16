import State from '../State.js';
import { GamePhases } from '../constants.js';

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
			State.set('gameSettings', 'displayType', this.content.displayToggle.checked ? '3D' : '2D');
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
		this.content.gameInformation = document.getElementById('gameInformation');
		this.update();
	}

	update() {
		this.updateScoreCard()
		this.updateGameInformation();
	}

	updateGameInformation() {
		const gamePhase = State.get('gameData', 'phase');
		switch (gamePhase) {
			case GamePhases.WAITING_TO_START:
				this.content.gameInformation.innerHTML = 'Press Enter to Start';
				break;
			case GamePhases.COUNTDOWN:
				this.content.gameInformation.innerHTML = Math.ceil(State.get("gameData", "countdown").toString());
				break;
			case GamePhases.RUNNING:
				this.content.gameInformation.innerHTML = '&nbsp;';
				break;
			case GamePhases.MATCH_ENDED:
				this.content.gameInformation.innerHTML = ' ';
				//const winner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
				//this.drawTopText(`${winner.name} wins the match!`);
				break;
			case GamePhases.FINISHED:
				this.content.gameInformation.innerHTML = 'Tournament Ended';
				//this.drawTopText('Tournament Completed!');
				//const tournamentWinner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
				//this.drawBottomText(`${tournamentWinner.name} wins the tournament!`);
				break;
		}
	}

	// tournament
	updateScoreCard() {
		var currentMatch = State.get('tournament', 'matches')[State.get('tournament', 'currentMatchIndex')];
		// this.content.scoreCard.player1Name.innerHTML = State.get('gameData', 'constants', 'player1Username');
		// this.content.scoreCard.player2Name.innerHTML = State.get('gameData', 'constants', 'player2Username');
		// this.content.scoreCard.player1Score.innerHTML = State.get('gameData', 'torunament', 'matches');
		// this.content.scoreCard.player2Score.innerHTML = State.get('gameData', 'player2Score');
		this.content.scoreCard.player1Name.innerHTML = currentMatch.players[0].name;
		this.content.scoreCard.player2Name.innerHTML = currentMatch.players[1].name;
		this.content.scoreCard.player1Score.innerHTML = currentMatch.players[0].score;
		this.content.scoreCard.player2Score.innerHTML = currentMatch.players[1].score;
	}

}