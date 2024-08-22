class Input {
	constructor(game) {
		this.game = game;
	}

	init() {
		document.addEventListener('keydown', (e) => this.handleKeyPress(e));
	}

	handleKeyPress(e) {
		switch(e.key) {
			case ' ':
				if (this.game.waitingForSpaceBar) {
					this.game.waitingForSpaceBar = false;
					this.game.isGameRunning = true;
				}
				break;
			case 'Enter': 
				console.log("Enter pressed"); 
				if (this.game.waitingForEnter) {
					this.game.startNextMatch();
				}
				break;
			case 'w': this.game.physics.leftPaddleY -= 10; break;
			case 's': this.game.physics.leftPaddleY += 10; break;
			case 'ArrowUp': this.game.physics.rightPaddleY -= 10; break;
			case 'ArrowDown': this.game.physics.rightPaddleY += 10; break;
		}
	}
}