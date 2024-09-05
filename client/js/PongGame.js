import { GameModes, GameStates } from './gameConstants.js';
import { Render, InputHandler, GamePhysics, GameState, UIManager, AIPlayer, Tournament } from './index.js';

class PongGame {
	constructor(settings) {
        this.tournamentSettings = settings;
        this.players = [];
        this.tournament = null;
        this.elementsInitialized = false;
        this.modulesInitialized = false;
        this.isRunning = false;
    }

	init() {
        console.log('PongGame init called');
        return this.initializeGameComponents().then(() => {
            this.startGame();
        });
    }


	initializeGameComponents() {
		console.log('Initializing game components');
		return new Promise((resolve, reject) => {
			const initFunction = () => {
				this.initElements()
					.then(() => this.initModules())
					.then(() => {
						console.log('All game components initialized');
						resolve();
					})
					.catch(error => {
						console.error('Failed to initialize game components:', error);
						reject(error);
					});
			};

			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', initFunction);
			} else {
				initFunction();
			}
		});
	}

	initElements() {
		console.log('Initializing game elements');
		return new Promise((resolve, reject) => {
			// Debug: Log the entire document body
			console.log('Document body:', document.body.innerHTML);

			this.canvas = document.getElementById('gameCanvas');
			console.log('Canvas element:', this.canvas);

			if (!this.canvas) {
				console.warn('Game canvas not found, attempting to find it by query selector');
				this.canvas = document.querySelector('canvas#gameCanvas');
			}

			if (!this.canvas) {
				console.error('Game canvas still not found. Available elements with ID "gameCanvas":', document.querySelectorAll('[id="gameCanvas"]'));
				return reject(new Error('Game canvas not found'));
			}

			this.ctx = this.canvas.getContext('2d');
			this.gameView = document.getElementById('gameView');
			this.playerInfo = document.getElementById('playerInfo');
			this.tournamentInfoMatches = document.getElementById('tournamentInfoMatches');
			this.tournamentInfoStandings = document.getElementById('tournamentInfoStandings');

			console.log('Game view:', this.gameView);
			console.log('Player info:', this.playerInfo);
			console.log('Tournament info matches:', this.tournamentInfoMatches);
			console.log('Tournament info standings:', this.tournamentInfoStandings);

			if (!this.gameView || !this.playerInfo || !this.tournamentInfoMatches || !this.tournamentInfoStandings) {
				console.error('One or more required elements not found');
				return reject(new Error('One or more required elements not found'));
			}

			this.elementsInitialized = true;
			resolve();
		});
	}

	initModules() {
		console.log('Initializing game modules');
		return new Promise((resolve, reject) => {
			if (!this.elementsInitialized) {
				return reject(new Error('Elements not initialized. Cannot initialize modules.'));
			}

			this.render = new Render(this);
			this.input = new InputHandler(this);
			this.physics = new GamePhysics(this);
			this.state = new GameState(this);
			this.uiManager = new UIManager(this);
			this.aiPlayer = new AIPlayer(this);

			this.modulesInitialized = true;
			this.input.init();
			this.physics.init();
			resolve();
		});
	}

	handleFormSubmit(e) {
		e.preventDefault();
		this.collectPlayerData();
		this.setupGameView();
		this.initializeGameComponents()
			.then(() => {
				this.tournament = new Tournament(this, this.players, this.tournamentSettings);
				this.startGame();
			})
			.catch(error => {
				console.error('Failed to initialize game components:', error);
			});
	}

	collectPlayerData() {
		console.log('Collecting player data');
		this.players = [];
		const playerInputs = document.querySelectorAll('#playerInputs input');
		playerInputs.forEach((input, index) => {
			const playerName = input.value.trim() || `Player ${index + 1}`;
			this.players.push({
				name: playerName,
				score: 0
			});
		});
		if (this.tournamentSettings.mode === GameModes.SINGLE) {
			this.players.push({
				name: "AI Player",
				score: 0
			});
		}
		console.log('Players:', this.players);
	}

	setupGameView() {
		console.log('Setting up game view');
		if (this.gameSetupView) this.gameSetupView.style.display = 'none';
		if (this.settingsView) this.settingsView.style.display = 'none';
		if (this.gameView) this.gameView.style.display = 'block';
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