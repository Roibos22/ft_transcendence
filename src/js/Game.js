class Game {
	constructor() {
		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.gameSetupView = document.getElementById('gameSetupView');
		this.playerForm = document.getElementById('playerForm');
		this.gameView = document.getElementById('gameView');
		this.settingsView = document.getElementById('settingsView');
		this.playerInfo = document.getElementById('playerInfo');
		this.tournamentInfo = document.getElementById('tournamentInfo');
		this.tournamentInfoMatches = document.getElementById('tournamentInfoMatches');
		this.tournamentInfoStandings = document.getElementById('tournamentInfoStandings');

		this.render = new Render(this);
		this.input = new Input(this);
		this.physics = new GamePhysics(this);
		this.state = new GameState(this);
		this.uiManager = new UIManager(this);

		this.players = [];
		this.tournament = null;

		this.tournamentSettings = {
			pointsToWin: 5,
			numberOfGames: 1
		};
	}

	init() {
		document.getElementById('startGame').addEventListener('click', (e) => this.handleFormSubmit(e));
		console.log('Starting the game!');
		this.input.init();
	}

	handleFormSubmit(e) {
		e.preventDefault();

		const playerInputs = document.querySelectorAll('#playerInputs input');

		playerInputs.forEach((input, index) => {
			const playerName = input.value.trim() || `Player ${index + 1}`;
			this.players.push({
				name: playerName,
				score: 0
			});
		});

		while (this.players.length < 2) {
			this.players.push({
				name: `Player ${this.players.length + 1}`,
				score: 0
			});
		}

		this.gameSetupView.style.display = 'none';
		this.settingsView.style.display = 'none';
		this.gameView.style.display = 'block';

		this.tournament = new Tournament(this, this.players, this.tournamentSettings);
		this.startGame()
	}

	startGame() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.state.waitingForSpaceBar = true;
		this.state.isGameRunning = false;
		this.physics.resetBallPosition();
		this.uiManager.updateScoreDisplay();
		this.render.draw();
		this.gameLoop();
	}

	gameLoop() {
		if (this.state.isGameRunning) {
			this.physics.movePaddles();
			this.physics.moveBall();
			this.physics.checkCollision();
		}
		this.render.draw();
		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}
}
