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

		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		switch (this.game.state.currentState) {
			case GameStates.WAITING_TO_START:
				this.drawTopText('Press Enter to Start');
				break;
			case GameStates.COUNTDOWN:
				this.drawTopText(this.game.state.countdownValue.toString());
				break;
			case GameStates.MATCH_ENDED:
				const currentMatch = this.game.tournament.getCurrentMatch();
				const winner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
				this.drawTopText(`${winner.name} wins the match!`);
				this.drawBottomText('Press Enter for next match');
				break;
			case GameStates.FINISHED:
				this.drawTopText('Tournament Completed!');
				const finalMatch = this.game.tournament.getCurrentMatch();
				const tournamentWinner = finalMatch.players[0].score > finalMatch.players[1].score ? finalMatch.players[0] : finalMatch.players[1];
				this.drawBottomText(`${tournamentWinner.name} wins the tournament!`);
				break;
		}
	}

	drawTopText(text, fontSize = '36px') {
		const { ctx, canvas } = this.game;
		ctx.font = `${fontSize} Arial`;
		ctx.fillText(text, canvas.width / 2, canvas.height / 4);
	}

	drawBottomText(text, fontSize = '36px') {
		const { ctx, canvas } = this.game;
		ctx.font = `${fontSize} Arial`;
		ctx.fillText(text, canvas.width / 2, canvas.height * 3 / 4);
	}
}