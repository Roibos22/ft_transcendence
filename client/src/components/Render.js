import { GameStates } from '../utils/shared.js';

export class Render {
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
				const nextMatch = this.game.tournament.getNextMatch();
				if (nextMatch) {
					const nextMatchText = `${nextMatch.players[0].name} vs ${nextMatch.players[1].name}`;
					this.drawBottomText(`Press Enter to start next match:\n${nextMatchText}`);
				}
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

	drawBottomText(text) {
		const { ctx, canvas } = this.game;
		const lines = text.split('\n');
		const lineHeight = 60; // Adjust this value to change the space between lines
		const startY = canvas.height * 3 / 4;

		ctx.font = '36px Arial';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		lines.forEach((line, index) => {
			ctx.fillText(line.trim(), canvas.width / 2, startY + (index * lineHeight));
		});
	}
}

export default Render;