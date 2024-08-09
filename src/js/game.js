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
		this.ballSpeedX = 5;
		this.ballSpeedY = 5;

		this.isGameRunning = false;
		this.waitingForSpaceBar = true;

		this.player1 = "";
		this.player2 = "";

		this.render = new Render(this);
		this.input = new Input(this);
	}

	init() {
		this.playerForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
		this.input.init();
		this.startGame();
	}

	handleFormSubmit(e) {
		e.preventDefault();
		this.player1 = document.getElementById('player1').value.trim() || "Player 1";
		this.player2 = document.getElementById('player2').value.trim() || "Player 2";

		this.gameSetup.style.display = 'none';
		this.gameView.style.display = 'block';

		this.playerInfo.textContent = `${this.player1} vs ${this.player2}`;
	}

	startGame() {
		this.waitingForSpaceBar = true;
		this.isGameRunning = false;
		this.resetBallPosition();
		this.gameLoop();
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

		if (this.ballX < 0 || this.ballX > this.canvas.width) {
			this.waitingForSpaceBar = true;
			this.isGameRunning = false;
			this.resetBallPosition();
		}
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