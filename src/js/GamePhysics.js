class GamePhysics {
	constructor(game) {
		this.game = game;

		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.ballRadius = 5;
		this.leftPaddleY = this.game.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.game.canvas.height / 2 - this.paddleHeight / 2;
		this.ballX = this.game.canvas.width / 2;
		this.ballY = this.game.canvas.height / 2;
		this.ballSpeedX = 8;
		this.ballSpeedY = 8;
	}

	movePaddles() {
		this.leftPaddleY = Math.max(Math.min(this.leftPaddleY, this.game.canvas.height - this.paddleHeight), 0);
		this.rightPaddleY = Math.max(Math.min(this.rightPaddleY, this.game.canvas.height - this.paddleHeight), 0);
	}

	moveBall() {
		this.ballX += this.ballSpeedX;
		this.ballY += this.ballSpeedY;

		if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.game.canvas.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

		if (this.ballX < 0) {
			this.game.tournament.getCurrentMatch().players[1].score++;
			this.game.state.waitingForSpaceBar = true;
			this.game.state.isGameRunning = false;
			this.resetBallPosition();
			this.game.updateStandings();
		} else if (this.ballX > this.game.canvas.width) {
			this.game.tournament.getCurrentMatch().players[0].score++;
			this.game.state.waitingForSpaceBar = true;
			this.game.state.isGameRunning = false;
			this.resetBallPosition();
			this.game.updateStandings();
		}
	}

	resetBallPosition() {
		this.ballX = this.game.canvas.width / 2;
		this.ballY = this.game.canvas.height / 2;
	}

	checkCollision() {
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