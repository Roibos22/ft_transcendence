class GamePhysics {
	constructor(game) {
		this.game = game;

		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.ballRadius = 5;
		this.ballSpeedX = 8;
		this.ballSpeedY = 8;
		this.paddleSpeed = 8;

		// Initialize these properties later
		this.leftPaddleY = 0;
		this.rightPaddleY = 0;
		this.ballX = 0;
		this.ballY = 0;
	}

	init() {
		if (!this.game.canvas) {
			console.error('Canvas not available. GamePhysics initialization failed.');
			return;
		}

		this.leftPaddleY = this.game.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.game.canvas.height / 2 - this.paddleHeight / 2;
		this.ballX = this.game.canvas.width / 2;
		this.ballY = this.game.canvas.height / 2;
	}

	resetPaddles() {
		if (!this.game.canvas) {
			console.error('Canvas not available. Cannot reset paddles.');
			return;
		}
		this.leftPaddleY = this.game.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.game.canvas.height / 2 - this.paddleHeight / 2;
	}

	movePaddles() {
		if (!this.game.canvas) {
			console.error('Canvas not available. Cannot move paddles.');
			return;
		}
		this.leftPaddleY = Math.max(Math.min(this.leftPaddleY, this.game.canvas.height - this.paddleHeight), 0);
		this.rightPaddleY = Math.max(Math.min(this.rightPaddleY, this.game.canvas.height - this.paddleHeight), 0);
	}

	moveBall() {
		if (!this.game.canvas) {
			console.error('Canvas not available. Cannot move ball.');
			return;
		}

		this.ballX += this.ballSpeedX;
		this.ballY += this.ballSpeedY;

		// horizontal collision
		if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.game.canvas.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

		// vertical collision -> point scored
		if (this.ballX < 0 || this.ballX > this.game.canvas.width) {
			if (this.ballX < 0) {
				this.game.tournament.getCurrentMatch().players[1].score++;
			} else if (this.ballX > this.game.canvas.width) {
				this.game.tournament.getCurrentMatch().players[0].score++;
			}
			this.game.state.pointScored();
		}
	}

	resetBallPosition() {
		if (!this.game.canvas) {
			console.error('Canvas not available. Cannot reset ball position.');
			return;
		}
		this.ballX = this.game.canvas.width / 2;
		this.ballY = this.game.canvas.height / 2;
	}

	checkCollision() {
		if (!this.game.canvas) {
			console.error('Canvas not available. Cannot check collision.');
			return;
		}

		if (this.ballX - this.ballRadius < this.paddleWidth && 
			this.ballY > this.leftPaddleY && 
			this.ballY < this.leftPaddleY + this.paddleHeight) {
				this.ballSpeedX = -this.ballSpeedX;
		}
		if (this.ballX + this.ballRadius > this.game.canvas.width - this.paddleWidth && 
			this.ballY > this.rightPaddleY && 
			this.ballY < this.rightPaddleY + this.paddleHeight) {
				this.ballSpeedX = -this.ballSpeedX;
		}
	}
}

export default GamePhysics;