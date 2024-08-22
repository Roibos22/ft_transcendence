class Render {
	constructor(game) {
		this.game = game;
	}

	draw() {
		const { paddleWidth, paddleHeight, ballRadius, leftPaddleY, rightPaddleY, ballX, ballY } = this.game.physics;
		const { ctx, canvas } = this.game;

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'white';
		ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
		ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

		ctx.beginPath();
		ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.closePath();

		if (this.game.waitingForSpaceBar) {
			ctx.fillStyle = 'white';
			ctx.font = '20px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 3);
		}

		if (this.game.gameFinished) {
			console.log("Draw win screen")
			ctx.fillStyle = 'white';
			ctx.font = '20px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Game Finished!', canvas.width / 2, canvas.height / 3);

			const currentMatch = this.game.tournament.getCurrentMatch();
			console.log(currentMatch);
			const winner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];

			ctx.fillStyle = 'white';
			ctx.font = '24px Arial';
			ctx.fillText(`${winner.name} wins!`, canvas.width / 2, canvas.height / 1.6);
				
			if (this.game.tournament.currentMatchIndex < this.game.tournament.matches.length) {
				ctx.fillText('Press Enter for next match', canvas.width / 2, canvas.height / 1.3);
			} else {
				ctx.fillText('Tournament Completed!', canvas.width / 2, canvas.height / 1.3);
			}
		}
	}
}