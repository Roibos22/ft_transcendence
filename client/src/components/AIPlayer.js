import { GamePhases } from "../constants.js";
import State from "../State.js";
import { deepCopy } from "../utils/utils.js";

export default class AIPlayer {
	constructor(game) {
		this.game = game;
		this.lastDecisionTime = 0;
		this.targetY = 0;
		this.paddleHeight = 50;
		this.paddleWidth = 10;
		this.ballRadius = 5;

		setInterval(() => this.calculateTargetY(), 1000);
		setInterval(() => this.movePaddle(), 1000 / 10);
	}

	calculateTargetY() {
		if (!this.game) return;

		const currentTime = performance.now();
		const ball = deepCopy(State.get('gameData', 'ball'));
		if (ball.velocity.x < 0) return;
		this.lastDecisionTime = currentTime;

		let ballFinalX = ball.x;
		let ballFinalY = ball.y;
		
		while (ballFinalX < this.game.map.width - this.paddleWidth) {
			ballFinalX += ball.velocity.x;
			ballFinalY += ball.velocity.y;
			if (ballFinalY < this.ballRadius || ballFinalY > this.game.map.height - this.ballRadius) {
				ball.velocity.y = -ball.velocity.y;
				ballFinalY = Math.min(Math.max(ballFinalY, this.ballRadius), this.game.map.height - this.ballRadius);
			}
		}

		this.targetY = ballFinalY;
	}

	movePaddle() {
		if (State.get('gameData', 'phase') !== GamePhases.RUNNING || (!this.game)) {
			return;
		}
	
		const playerY = State.get('gameData', 'player2Pos');
		if (playerY < this.targetY && playerY + this.paddleHeight > this.targetY) {
			this.game.socket.send(JSON.stringify({action: 'move_player', player_no: '2', direction: '0'}));
		} else if (playerY < this.targetY && playerY + this.paddleHeight < this.targetY) {
			this.game.socket.send(JSON.stringify({action: 'move_player', player_no: '2', direction: '1'}));
		} else {
			this.game.socket.send(JSON.stringify({action: 'move_player', player_no: '2', direction: '-1'}));
		}
	}

	destroy() {
		clearInterval(this.calculateInterval);
		clearInterval(this.moveInterval);
		this.calculateInterval = null;
		this.moveInterval = null;
		this.game = null;
	}
}