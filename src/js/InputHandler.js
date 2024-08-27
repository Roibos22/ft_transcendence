class Input {
	constructor(game) {
		this.game = game;
	}

	init() {
		document.addEventListener('keydown', (e) => this.handleKeyPress(e));
	}

	handleKeyPress(e) {
		switch(e.key) {
			case 'Enter':  this.handleEnterKey(); break;
			case 'w': this.game.physics.leftPaddleY -= 10; break;
			case 's': this.game.physics.leftPaddleY += 10; break;
			case 'ArrowUp': this.game.physics.rightPaddleY -= 10; break;
			case 'ArrowDown': this.game.physics.rightPaddleY += 10; break;
		}
	}

	handleEnterKey() {
		if (this.game.state.waitingForEnter) {
			if (this.game.state.currentState === GameStates.MATCH_ENDED) {
				this.game.tournament.currentMatchIndex++;
				this.game.state.startNextMatch();
				this.game.state.startCountdown()
			} else if (this.game.state.currentState === GameStates.FINISHED) {
				console.log("TOURNAMENT COMPLETED");
			} else {
				this.game.state.startCountdown();
			}
			this.game.state.waitingForEnter = false;
		}
	}
}