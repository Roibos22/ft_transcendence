import State from "../State.js";

export default class Engine {
    constructor() {
        this.paddleSpeed = 8;
        this.ballSpeed = 8;
        this.ballRadius = 5;
        this.field = {
            width: 1000,
            height: 500,
        };

        this.player1Direction = 0;
        this.player2Direction = 0;

        setInterval(() => this.update(), 1000 / 60);
    }

    startCountdown() {
        let count = 3;
        const interval = setInterval(() => {
            State.set('gameData', 'countdown', count);
            count--;
            if (count < 0) {
                clearInterval(interval);
                State.set('gameData', 'phase', 'PLAYING');
            }
        }, 1000);
    }

    resetPaddles() {
        const gameData = State.get('gameData');
        gameData.player1Pos = this.field.height / 2;
        gameData.player2Pos = this.field.height / 2;
        State.set('gameData', gameData);
        this.setPlayerDirection(1, 0);
        this.setPlayerDirection(2, 0);
	}

    resetBall() {
        const ball = State.get('gameData', 'ball');
        ball.x = this.field.width / 2;
        ball.y = this.field.height / 2;
        State.set('gameData', 'ball', ball);
    }

    moveBall() {
        const ball = State.get('gameData', 'ball');

		// horizontal collision
		if (ball.y - this.ballRadius < 0 || ball.y + this.ballRadius > this.field.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

        State.set('gameData', 'ball', ball);
	}

    setPlayerDirection(player, direction) {
        this[`player${player}Direction`] = direction;
    }

    checkCollision(position) {
        position = Math.max(position, 0);
        position = Math.min(position, this.field.height - paddleHeight);
        return position;
    }

    movePlayer(player) {
        const playerDirection = this[`player${player}Direction`];
        if (playerDirection === 0) {
            return;
        }
        const playerKey = `player${player}Pos`;
        const playerPosition = State.get('gameData', playerKey);
        const newPlayerPosition = playerPosition + playerDirection * this.paddleSpeed;
        State.set('gameData', playerKey, this.checkCollision(newPlayerPosition));
    }

    update() {
        this.moveBall();
        this.movePlayer(1);
        this.movePlayer(2);
    }

    checkIfScored() {
        const ball = State.get('gameData', 'ball');
        const currentMatch = State.get('currentMatch');

        if (ball.x < 0) {
            currentMatch.player2Score++;
            this.resetPaddles();
        } else if (ball.x > this.field.width) {
            currentMatch.player1Score++;
            this.resetPaddles();
        }

        State.set('currentMatch', currentMatch);
    }

}