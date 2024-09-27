import State from '../State.js';
import { GamePhases } from '../constants.js';

export default class TwoD {
	constructor(game) {
		this.canvas = null;
		this.ctx = null;
		this.game = game;

		this.init();
	}

	init() {
		this.canvas = document.getElementById('gameCanvas2D');
		this.ctx = this.canvas.getContext('2d');

		this.lastLogTime = 0;
		this.lastLogTime2 = 0;
		this.canvas.width = this.game.field.width;
		this.canvas.height = this.game.field.height;
		this.startGame();
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
		if (State.get('gameData', 'phase') !== GamePhases.RUNNING) {
			this.drawText();
		}
		this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
	}

	drawPaddles() {
		const paddleHeight = 50;
		const paddleWidth = 10;
		const player1PosState = State.data.gameData.player1Pos;
		const player2PosState = State.data.gameData.player2Pos;
		const leftPaddleY = (player1PosState || this.canvas.height / 2);
		const rightPaddleY = (player2PosState || this.canvas.height / 2);

		const currentTime = Date.now();
		if (currentTime - this.lastLogTime2 >= 1000) { // Check if 1 second has passed
			console.log("State Pos: ", player1PosState);
			console.log("leftPaddleY: ", leftPaddleY);
			this.lastLogTime2 = currentTime; // Update the last log time
		}
	
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
		this.ctx.fillRect(this.canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
	}

	drawBall() {
		var ball = State.data.gameData.ball;
		const ballRadius = 5;
	
		if (ball && State.data.gameData.countdown === 0) {
			this.ctx.beginPath();
			this.ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
			this.ctx.fillStyle = 'white';
			this.ctx.fill();
			this.ctx.closePath();
		}
	}

	// drawCountdown() {
	// 	this.ctx.font = `12 Arial`;
	// 	this.ctx.fillText(State.get('countdown'), this.canvas.width / 2, this.canvas.height / 2);
	// }
	

	drawBackground() {
		this.ctx.fillStyle = '#33CB99';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawText() {
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.font = '36px Arial';

		const currentMatch = State.get('currentMatch');

		const gamePhase = State.get('gameData', 'phase');
		switch (gamePhase) {
			case GamePhases.WAITING_TO_START:
				this.drawTopText('Press Enter to Start');
				break;
			case GamePhases.COUNTDOWN:
				this.drawTopText(State.get("gameData", "countdown").toString());
				break;
			case GamePhases.MATCH_ENDED:
				const winner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
				this.drawTopText(`${winner.name} wins the match!`);
				break;
			case GamePhases.FINISHED:
				this.drawTopText('Tournament Completed!');
				const tournamentWinner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
				this.drawBottomText(`${tournamentWinner.name} wins the tournament!`);
				break;
		}
	}

	drawTopText(text, fontSize = '36px') {
		this.ctx.font = `${fontSize} Arial`;
		this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 4);
	}

	drawBottomText(text) {
		const lines = text.split('\n');
		const lineHeight = 60; // Adjust this value to change the space between lines
		const startY = this.canvas.height * 3 / 4;

		this.ctx.font = '36px Arial';
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';

		lines.forEach((line, index) => {
			this.ctx.fillText(line.trim(), this.canvas.width / 2, startY + (index * lineHeight));
		});
	}

	show() {
		this.canvas.style.display = 'inline';
	}

	hide() {
		this.canvas.style.display = 'none';
	}
}