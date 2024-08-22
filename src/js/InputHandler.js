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
				if (this.game.state.waitingForSpaceBar) {
					this.game.state.waitingForSpaceBar = false;
					this.game.state.isGameRunning = true;
				}
				break;
			case 'Enter': 
				console.log("Enter pressed"); 
				if (this.game.state.waitingForEnter) {

					this.game.tournament.currentMatchIndex++;
					// if (this.game.tournament.currentMatchIndex >= this.game.tournament.matches.length) {
					// 	console.log("Tournament completed!");
					// }

					this.game.state.startNextMatch();
				}
				break;
			case 'w': this.game.physics.leftPaddleY -= 10; break;
			case 's': this.game.physics.leftPaddleY += 10; break;
			case 'ArrowUp': this.game.physics.rightPaddleY -= 10; break;
			case 'ArrowDown': this.game.physics.rightPaddleY += 10; break;
		}
	}
}