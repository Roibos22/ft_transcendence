class Game {
	constructor() {
		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.gameSetup = document.getElementById('gameSetup');
		this.playerForm = document.getElementById('playerForm');
		this.gameView = document.getElementById('gameView');
		this.playerInfo = document.getElementById('playerInfo');

		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.ballRadius = 5;

		this.leftPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
		this.ballSpeedX = 8;
		this.ballSpeedY = 8;

		this.isGameRunning = false;
		this.waitingForSpaceBar = true;

		this.render = new Render(this);
		this.input = new Input(this);
	}

	init() {
		document.getElementById('startGame').addEventListener('click', (e) => this.handleFormSubmit(e));
		console.log('Starting the game!');
		this.input.init();
		this.startGame();
	}

	startGame() {
		this.waitingForSpaceBar = true;
		this.isGameRunning = false;
		this.resetBallPosition();
		this.gameLoop();
	}

	handleFormSubmit(e) {
		e.preventDefault();

		const playerInputs = document.querySelectorAll('#playerInputs input');

		this.players = [];

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

		this.gameSetup.style.display = 'none';
		this.gameView.style.display = 'block';

		this.updateScoreDisplay();
	}

	gameLoop() {
		if (this.isGameRunning) {
			this.movePaddles();
			this.moveBall();
			this.checkCollision();
		}
		this.render.draw();
		requestAnimationFrame(() => this.gameLoop());
	}

	movePaddles() {
		this.leftPaddleY = Math.max(Math.min(this.leftPaddleY, this.canvas.height - this.paddleHeight), 0);
		this.rightPaddleY = Math.max(Math.min(this.rightPaddleY, this.canvas.height - this.paddleHeight), 0);
	}

	moveBall() {
		this.ballX += this.ballSpeedX;
		this.ballY += this.ballSpeedY;

		if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvas.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

		if (this.ballX < 0) {
			this.players[1].score++;
			this.waitingForSpaceBar = true;
			this.isGameRunning = false;
			this.resetBallPosition();
			this.updateScoreDisplay();
		} else if (this.ballX > this.canvas.width) {
			this.players[0].score++;
			this.waitingForSpaceBar = true;
			this.isGameRunning = false;
			this.resetBallPosition();
			this.updateScoreDisplay();
		}
	}

	updateScoreDisplay() {
		this.playerInfo.textContent = `${this.players[0].name} (${this.players[0].score}) vs ${this.players[1].name} (${this.players[1].score})`;
	}

	resetBallPosition() {
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
	}

	checkCollision() {
		if (this.ballX - this.ballRadius < this.paddleWidth && this.ballY > this.leftPaddleY && this.ballY < this.leftPaddleY + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		}
		if (this.ballX + this.ballRadius > this.canvas.width - this.paddleWidth && this.ballY > this.rightPaddleY && this.ballY < this.rightPaddleY + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		}
	}
}