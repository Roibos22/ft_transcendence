import state from '../State.js';

export default class TwoD {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = null;

        this.init();
    }

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.startGame();
    }

    startGame() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.update();
	}

    drawPaddles() {
        const paddleHeight = 100;
        const paddleWidth = 10;
        const leftPaddleY = (state.get('gameData', 'player1pos') || this.canvas.height / 2) - paddleHeight / 2;
        const rightPaddleY = (state.get('gameData', 'player2pos') || this.canvas.height / 2) - paddleHeight / 2;

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
        this.ctx.fillRect(this.canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    }

    drawBall() {
        const { ball } = state.get('gameData');
        const ballRadius = 5;

        this.ctx.beginPath();
		this.ctx.arc(ball.x, ball.x, ballRadius, 0, Math.PI * 2);
		this.ctx.fillStyle = 'white';
		this.ctx.fill();
		this.ctx.closePath();
    }

    drawBackground() {
        this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        this.drawBackground();
        this.drawPaddles();
        this.drawBall();
    }
}