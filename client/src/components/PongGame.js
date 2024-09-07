import { Input } from './InputHandler.js';
import { Render } from './Render.js';
import { GamePhysics } from './GamePhysics.js';
import { GameState } from './GameState.js';
import { UIManager } from './UIManager.js';
import { AIPlayer } from './AIPlayer.js';
import { GameModes, GameStates } from '../utils/shared.js';

export class PongGame {
	constructor(settings) {
		this.tournamentSettings = settings;

		this.initElements()
		this.initModules()

		this.tournament = null;
	}

	initModules() {
		this.input = new Input(this);
		this.input.init();
		this.render = new Render(this);
		this.physics = new GamePhysics(this);
		this.state = new GameState(this);
		this.uiManager = new UIManager(this);
		this.aiPlayer = new AIPlayer(this);
	}

	initElements() {
		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.gameView = document.getElementById('gameView');
		this.playerInfo = document.getElementById('playerInfo');
		this.tournamentInfo = document.getElementById('tournamentInfo');
		this.tournamentInfoMatches = document.getElementById('tournamentInfoMatches');
		this.tournamentInfoStandings = document.getElementById('tournamentInfoStandings');
		this.pointsToWinDisplay = document.getElementById('pointsToWinDisplay');
		this.numberOfGamesDisplay = document.getElementById('numberOfGamesDisplay');
	}

	startGame(players) {
		console.log('Starting game with players:', players);
		this.players = players;
		
		if (this.tournamentSettings.mode === GameModes.SINGLE && this.players.length === 1) {
			this.players.push({ name: "AI Player", score: 0 });
		}

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		if (this.state && this.modulesInitialized) {
			this.tournament = new Tournament(this, this.players, this.tournamentSettings);
			this.state.startNextMatch();
			this.gameLoop();
		} else {
			console.error('Game not fully initialized');
		}
	}

	gameLoop() {
		if (!this.modulesInitialized) {
			console.error('Game modules not initialized');
			return;
		}

		this.input.update();
		if (this.state.currentState === GameStates.RUNNING) {
			this.physics.moveBall();
			this.physics.checkCollision();
			if (this.tournamentSettings.mode === GameModes.SINGLE) {
				this.aiPlayer.update();
			}
		}
		this.physics.movePaddles();
		this.render.draw();
		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}
}

export default PongGame;