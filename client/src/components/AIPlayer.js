import { GamePhases } from "../constants.js";
import State from "../State.js";

export default class AIPlayer {
	constructor(game) {
		this.game = game;
		this.lastDecisionTime = 0;
		this.decisionInterval = 1000;
		this.targetY = 0;
		this.paddleHeight = 50;
        this.paddleWidth = 10;

        setInterval(() => {
            this.update();
        }, 100);  
	}

	update() {
        if (State.get('gameData', 'phase') !== GamePhases.RUNNING) {
            return;
        }
		const currentTime = performance.now();
		
		if (currentTime - this.lastDecisionTime >= this.decisionInterval) {
			this.decideMove();
			this.lastDecisionTime = currentTime;
		}
		
        const playerY = State.get('gameData', 'player2Pos');

		const distanceToTarget = this.targetY - playerY;
        const direction = distanceToTarget > '0' ? '1' : distanceToTarget < '0' ? '-1' : '0';

        console.log("Direction: ", direction);

        if (this.game.socket){
		    this.game.socket.send(JSON.stringify({action: 'move_player', player_no: '2', direction: direction}));
	    }
    }

	decideMove() {
		const predictedY = this.predictBallY();
		
		const randomFactor = (Math.random() - 0.5) * this.paddleHeight;
		this.targetY = predictedY + randomFactor - this.paddleHeight / 2;

		if (Math.random() < 0.05) {
			this.targetY += (Math.random() > 0.5 ? 1 : -1) * this.paddleHeight;
		}

		this.targetY = Math.max(0, Math.min(this.game.map.height - this.paddleHeight, this.targetY));
	}

	predictBallY() {
		const ball = State.get('gameData', 'ball');
		const mapHeight = this.game.map.height;
		const aiPaddleX = this.game.map.width - this.paddleWidth;

		const timeToReach = (aiPaddleX - ball.x) / ball.speed;
		let verticalDistance = ball.speed * timeToReach;
		let finalY = ball.y + verticalDistance;

		const bounces = Math.floor(Math.abs(finalY) / mapHeight);
		const remainder = Math.abs(finalY) % mapHeight;
		if (bounces % 2 === 0) {
			finalY = (ball.speed > 0) ? remainder : mapHeight - remainder;
		} else {
			finalY = (ball.speed > 0) ? mapHeight - remainder : remainder;
		}

		return finalY;
	}
}