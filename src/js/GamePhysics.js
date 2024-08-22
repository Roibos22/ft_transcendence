class GamePhysics {
	constructor(game) {
		this.game = game;
	}

	

	movePaddles() {
		this.game.leftPaddleY = Math.max(Math.min(this.game.leftPaddleY, this.game.canvas.height - this.game.paddleHeight), 0);
		this.game.rightPaddleY = Math.max(Math.min(this.game.rightPaddleY, this.game.canvas.height - this.game.paddleHeight), 0);
	}

	moveBall() {
		this.game.ballX += this.game.ballSpeedX;
		this.game.ballY += this.game.ballSpeedY;

		if (this.game.ballY - this.game.ballRadius < 0 || this.game.ballY + this.game.ballRadius > this.game.canvas.height) {
			this.game.ballSpeedY = -this.game.ballSpeedY;
		}

		if (this.game.ballX < 0) {
			this.game.tournament.getCurrentMatch().players[1].score++;
			this.game.waitingForSpaceBar = true;
			this.game.isGameRunning = false;
			this.resetBallPosition();
			this.game.updateStandings();
		} else if (this.game.ballX > this.game.canvas.width) {
			this.game.tournament.getCurrentMatch().players[0].score++;
			this.game.waitingForSpaceBar = true;
			this.game.isGameRunning = false;
			this.resetBallPosition();
			this.game.updateStandings();
		}
	}

	resetBallPosition() {
		this.game.ballX = this.game.canvas.width / 2;
		this.game.ballY = this.game.canvas.height / 2;
	}

	checkCollision() {
		if (this.game.ballX - this.game.ballRadius < this.game.paddleWidth && 
			this.game.ballY > this.game.leftPaddleY && 
			this.game.ballY < this.game.leftPaddleY + this.game.paddleHeight) {
			this.game.ballSpeedX = -this.game.ballSpeedX;
		}
		if (this.game.ballX + this.game.ballRadius > this.game.canvas.width - this.game.paddleWidth && 
			this.game.ballY > this.game.rightPaddleY && 
			this.game.ballY < this.game.rightPaddleY + this.game.paddleHeight) {
			this.game.ballSpeedX = -this.game.ballSpeedX;
		}
	}
}