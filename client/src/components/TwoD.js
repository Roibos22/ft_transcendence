import State from '../State.js';

export default class TwoD {
	constructor(game) {
		this.canvas = null;
		this.ctx = null;
		this.game = game;

		this.init();
		this.printGameStatus();
	}

	init() {
		this.canvas = document.getElementById('gameCanvas2D');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = this.game.map.width;
		this.canvas.height = this.game.map.height;
		this.startGame();
	}

	printGameStatus() {
		setInterval(() => {
			console.log(State);
		}, 2000);
	}

	startGame() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.gameLoop();
	}

	gameLoop() {
		this.drawBackground();
		this.drawPaddles();
		this.drawBall();
		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}

	drawPaddles() {
		const gameData = State.get('gameData');
		const paddleHeight = gameData.constants.paddleHeight;
		const paddleWidth = gameData.constants.paddleWidth;
		const leftPaddleY = gameData.player1Pos;
		const rightPaddleY = gameData.player2Pos;
	
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
		this.ctx.fillRect(this.canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
	}

	drawBall() {
		const ball = State.get('gameData', 'ball');
		const ballRadius = 5;
	
		if (ball) {
			this.ctx.beginPath();
			this.ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
			this.ctx.fillStyle = 'white';
			this.ctx.fill();
			this.ctx.closePath();
		}
	}

	drawBackground() {
		this.ctx.fillStyle = '#4CAF50';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	show() {
		this.canvas.style.display = 'inline';
	}

	hide() {
		this.canvas.style.display = 'none';
	}
}