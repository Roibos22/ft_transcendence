class Input {
	constructor(game) {
		this.game = game;
		this.keys = {
			w: false,
			s: false,
			ArrowUp: false,
			ArrowDown: false
		};
		this.paddleSpeed = 5; // Pixels per frame
	}

	init() {
		document.addEventListener('keydown', (e) => this.handleKeyDown(e));
		document.addEventListener('keyup', (e) => this.handleKeyUp(e));
	}

	handleKeyDown(e) {
		if (e.key in this.keys) {
			this.keys[e.key] = true;
		} else if (e.key === 'Enter') {
			this.handleEnterKey();
		}
	}

	handleKeyUp(e) {
		if (e.key in this.keys) {
			this.keys[e.key] = false;
		}
	}

	handleEnterKey() {
		if (this.game.state.waitingForEnter) {
			if (this.game.state.currentState === GameStates.MATCH_ENDED) {
				this.game.tournament.currentMatchIndex++;
				this.game.state.startNextMatch();
				this.game.state.startCountdown();
			} else if (this.game.state.currentState === GameStates.FINISHED) {
				console.log("TOURNAMENT COMPLETED");
				// Add logic to restart the tournament or return to main menu
			} else {
				this.game.state.startCountdown();
			}
			this.game.state.waitingForEnter = false;
		}
	}

	update() {
		if (this.game.state.currentState === GameStates.RUNNING || this.game.state.currentState === GameStates.COUNTDOWN) {
			if (this.keys.w) {
				this.game.physics.leftPaddleY = Math.max(
					0, 
					this.game.physics.leftPaddleY - this.paddleSpeed
				);
			}
			if (this.keys.s) {
				this.game.physics.leftPaddleY = Math.min(
					this.game.canvas.height - this.game.physics.paddleHeight, 
					this.game.physics.leftPaddleY + this.paddleSpeed
				);
			}
			if (this.keys.ArrowUp) {
				this.game.physics.rightPaddleY = Math.max(
					0, 
					this.game.physics.rightPaddleY - this.paddleSpeed
				);
			}
			if (this.keys.ArrowDown) {
				this.game.physics.rightPaddleY = Math.min(
					this.game.canvas.height - this.game.physics.paddleHeight, 
					this.game.physics.rightPaddleY + this.paddleSpeed
				);
			}
		}
	}
}