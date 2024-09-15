import { PongGame } from '../components/PongGame.js';
import { Tournament } from '../components/Tournament.js';
import { GameTypes } from '../constants.js';
import { loadTemplate } from '../router.js';

export class GameView {
	constructor() {
		this.game = null;
		this.content = {
			scoreCard: {
				player1Name: null,
				player2Name: null,
				player1Score: null,
				player2Score: null,
			},
			gameCanvas: null,
			fixtures: null,
			standings: null,
		}
	}

	async init() {
        const content = await loadTemplate('game');
        document.getElementById('app').innerHTML = content;

		this.setupcontent();
		this.startGame();
	}

	setupcontent() {
		this.content.scoreCard = {
			player1Name: document.getElementById('player1Name'),
			player2Name: document.getElementById('player2Name'),
			player1Score: document.getElementById('player1Score'),
			player2Score: document.getElementById('player2Score'),
		};
		this.content.gameCanvas = document.getElementById('gameCanvas');
		this.content.fixtures = document.getElementById('fixtures');
		this.content.standings = document.getElementById('standings');
	}

	startGame() {
		this.game = new PongGame();
		this.game.tournament = new Tournament(this.game);
		this.game.startGame();
	}
}
