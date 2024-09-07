export class AIPlayer {
	constructor(game) {
		this.game = game;
		this.lastDecisionTime = 0;
		this.decisionInterval = 1000;
		this.targetY = this.game.physics.rightPaddleY;
		this.paddleHeight = this.game.physics.paddleHeight;
	}

	update() {
		const currentTime = performance.now();
		
		if (currentTime - this.lastDecisionTime >= this.decisionInterval) {
			this.decideMove();
			this.lastDecisionTime = currentTime;
		}
		
		const distanceToTarget = this.targetY - this.game.physics.rightPaddleY;
		const direction = Math.sign(distanceToTarget);
		const movement = Math.min(Math.abs(distanceToTarget), this.game.physics.paddleSpeed);
		
		this.game.physics.rightPaddleY += direction * movement;
		this.game.physics.rightPaddleY = Math.max(0, Math.min(this.game.canvas.height - this.paddleHeight, this.game.physics.rightPaddleY));
	}

	decideMove() {
		const predictedY = this.predictBallY();
		
		const randomFactor = (Math.random() - 0.5) * this.paddleHeight;
		this.targetY = predictedY + randomFactor - this.paddleHeight / 2;

		if (Math.random() < 0.05) {
			this.targetY += (Math.random() > 0.5 ? 1 : -1) * this.paddleHeight;
		}

		this.targetY = Math.max(0, Math.min(this.game.canvas.height - this.paddleHeight, this.targetY));
	}

	predictBallY() {
		const { ballX, ballY, ballSpeedX, ballSpeedY } = this.game.physics;
		const canvasHeight = this.game.canvas.height;
		const aiPaddleX = this.game.canvas.width - this.game.physics.paddleWidth;

		const timeToReach = (aiPaddleX - ballX) / ballSpeedX;
		let verticalDistance = ballSpeedY * timeToReach;
		let finalY = ballY + verticalDistance;

		const bounces = Math.floor(Math.abs(finalY) / canvasHeight);
		const remainder = Math.abs(finalY) % canvasHeight;
		if (bounces % 2 === 0) {
			finalY = (ballSpeedY > 0) ? remainder : canvasHeight - remainder;
		} else {
			finalY = (ballSpeedY > 0) ? canvasHeight - remainder : remainder;
		}

		return finalY;
	}
}

export default AIPlayer;