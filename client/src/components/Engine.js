import State from "../State";

export class Engine {
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

        this.init();
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
		State.set('gameData', 'player1Pos', 0);
        State.set('gameData', 'player2Pos', 0);
        this.setPlayerDirection(1, 0);
        this.setPlayerDirection(2, 0);
	}

    moveBall() {
        const ball = State.get('gameData', 'ball');
        const currentMatch = State.get('tournament', 'currentMatch');

		// horizontal collision
		if (ball.y - this.ballRadius < 0 || ball.y + this.ballRadius > this.field.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

		// vertical collision -> point scored
		// if (ball.x < 0 || ball.x > this.field.width) {
		// 	if (ball.x < 0) {
		// 		this.game.tournament.getCurrentMatch().players[1].score++;
		// 	} else if (ball.x > this.field.width) {
		// 		this.game.tournament.getCurrentMatch().players[0].score++;
		// 	}
		// 	this.game.state.pointScored();
		// }

        State.set('currentMatch', currentMatch);
        State.set('gameData', 'ball', ball);
	}

    setPlayerDirection(player, direction) {
        this[`player${player}Direction`] = direction;
    }

    checkCollision(position) {
        position = Math.max(position, 0);
        position = Math.min(position, this.field.height);
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

}