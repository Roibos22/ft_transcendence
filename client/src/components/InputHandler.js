export default class InputHandler {
	constructor(game) {
		this.game = game;
		this.init();
	}

	init() {
		document.addEventListener('keydown', (e) => this.handleKeyDown(e));
		document.addEventListener('keyup', (e) => this.handleKeyUp(e));
		window.addEventListener('keydown', (e) => this.preventDefaultScroll(e));
	}

	preventDefaultScroll(e) {
		if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
			e.preventDefault();
		}
	}

	handleKeyDown(e) {
		switch(e.key) {
			case 'w':
				this.game.engine.setPlayerDirection(1, -1);
				break;
			case 's':
				this.game.engine.setPlayerDirection(1, 1);
				break;
			case 'ArrowUp':
				this.game.engine.setPlayerDirection(2, -1);
				break;
			case 'ArrowDown':
				this.game.engine.setPlayerDirection(2, 1);
				break;
			case 'Enter':
				this.handleEnterKey();

		}
	}

	handleKeyUp(e) {
		switch(e.key) {
			case 'w':
			case 's':
				this.game.engine.setPlayerDirection(1, 0);
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				this.game.engine.setPlayerDirection(2, 0);
				break;
		}
	}

	handleEnterKey() {
		// if (this.game.state.waitingForEnter) {
		// 	if (State.get('gameData', 'phase') === GamePhases.MATCH_ENDED) {
		// 		incrementCurrentMatchIndex();
		// 		this.game.State.startNextMatch();
		// 		this.game.State.startCountdown();
		// 	} else if (State.get('gameData', 'phase') === GamePhases.FINISHED) {
		// 		console.log("TOURNAMENT COMPLETED");
		// 		// Add logic to restart the tournament or return to main menu
		// 	} else {
		// 		this.game.State.startCountdown();
		// 	}
		// 	this.game.State.waitingForEnter = false;
		// }
	}
}