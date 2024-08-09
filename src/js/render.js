class Render {
	constructor(game) {
		this.game = game;
	}

	draw() {
		const { ctx, canvas, paddleWidth, paddleHeight, ballRadius } = this.game;

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'white';
		ctx.fillRect(0, this.game.leftPaddleY, paddleWidth, paddleHeight);
		ctx.fillRect(canvas.width - paddleWidth, this.game.rightPaddleY, paddleWidth, paddleHeight);

		ctx.beginPath();
		ctx.arc(this.game.ballX, this.game.ballY, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.closePath();

		if (this.game.waitingForSpaceBar) {
			ctx.fillStyle = 'white';
			ctx.font = '20px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 3);
		}
	}
}