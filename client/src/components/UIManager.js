import State from '../State.js';
import { GamePhases, GameTypes } from '../constants.js';

export class UIManager {
	constructor() {
		this.content = {
			canvases: {
				twoD: document.getElementById('gameCanvas2D'),
				threeD: document.getElementById('gameCanvas3D'),
			},
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
			const show3D = this.content.displayToggle.checked;
			State.set('gameSettings', 'displayType', show3D ? GameTypes.THREE_D : GameTypes.TWO_D);
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
		this.content.goBackButton = document.getElementById('goBackButton');
		this.update();
	}

	updateCanvases() {
		const displayType = State.get('gameSettings', 'displayType');
		this.content.canvases.twoD.style.display = displayType === GameTypes.TWO_D ? 'inline' : 'none';
		this.content.canvases.threeD.style.display = displayType === GameTypes.THREE_D ? 'inline' : 'none';
	}

	update() {
		this.updateCanvases();
		this.updateScoreCard();
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
				this.content.gameInformation.innerHTML = 'Game Finished';
				this.content.goBackButton.style.display = 'inline';
				break;
			case GamePhases.FINISHED:
				this.content.gameInformation.innerHTML = 'Tournament Finished';
				this.content.goBackButton.style.display = 'inline';
				break;
		}
	}

	updateScoreCard() {
		const gameData = State.get('gameData');
		const player2Name = State.get('tournament', 'matches')[State.get('tournament', 'currentMatchIndex')].players[1].name;
		this.content.scoreCard.player1Name.innerHTML = gameData.constants.player1Username;
		this.content.scoreCard.player2Name.innerHTML = player2Name;
		this.content.scoreCard.player1Score.innerHTML = gameData.player1Score;
		this.content.scoreCard.player2Score.innerHTML = gameData.player2Score;
	}
}