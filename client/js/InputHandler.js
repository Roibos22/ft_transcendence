class Input {
	constructor(game) {
		this.game = game;
	}

	init() {
		document.addEventListener('keydown', (e) => this.handleKeyPress(e));
	}

	handleKeyPress(e) {
		switch(e.key) {
			case ' ': this.handleSpacebarKey(); break;
			case 'Enter':  this.handleEnterKey(); break;
			case 'w': this.game.physics.leftPaddleY -= 10; break;
			case 's': this.game.physics.leftPaddleY += 10; break;
			case 'ArrowUp': this.game.physics.rightPaddleY -= 10; break;
			case 'ArrowDown': this.game.physics.rightPaddleY += 10; break;
		}
	}

	handleSpacebarKey() {
		if (this.game.state.waitingForSpaceBar) {
			this.game.state.waitingForSpaceBar = false;
			this.game.state.isGameRunning = true;
		}
	}

	handleEnterKey() {
		if (this.game.state.waitingForEnter) {
			this.game.tournament.currentMatchIndex++;
			this.game.state.startNextMatch();
		}
	}
}