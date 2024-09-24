import state from '../State.js';
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
        if (state.get('gameData', 'phase') !== GamePhases.RUNNING) {
            this.drawText();
        }
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    drawPaddles() {
        const paddleHeight = 100;
        const paddleWidth = 10;
        const leftPaddleY = (state.get('gameData', 'player1Pos') || this.canvas.height / 2) - paddleHeight / 2;
        const rightPaddleY = (state.get('gameData', 'player2Pos') || this.canvas.height / 2) - paddleHeight / 2;

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

    drawText() {
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.font = '36px Arial';

        const currentMatch = state.get('currentMatch');

        const gamePhase = state.get('gameData', 'phase');

        switch (gamePhase) {
            case GamePhases.WAITING_TO_START:
                this.drawTopText('Press Enter to Start');
                break;
            case GamePhases.COUNTDOWN:
                this.drawTopText(state.get("gameData", "countdown").toString());
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
}