import { GameModes, GamePhases } from '../constants.js';
import { incrementCurrentMatchIndex } from '../utils/utils.js';
import State from '../State.js';

export default class InputHandler {
	constructor(game) {
		this.game = game;
	}

	init() {
		window.addEventListener('keydown', (e) => this.preventDefaultScroll(e));
		document.addEventListener('keydown', (e) => this.handleKeyDown(e));
		document.addEventListener('keyup', (e) => this.handleKeyUp(e));
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
		if (this.game.state.waitingForEnter) {
			if (State.get('gameData', 'phase') === GamePhases.MATCH_ENDED) {
				incrementCurrentMatchIndex();
				this.game.State.startNextMatch();
				this.game.State.startCountdown();
			} else if (State.get('gameData', 'phase') === GamePhases.FINISHED) {
				console.log("TOURNAMENT COMPLETED");
				// Add logic to restart the tournament or return to main menu
			} else {
				this.game.State.startCountdown();
			}
			this.game.State.waitingForEnter = false;
		}
	}

	update() {
		if (State.get('gameSettings', 'mode') === GameModes.SINGLE) {
			this.updateSinglePlayerMode();
		} else if (State.get('gameSettings', 'mode') === GameModes.MULTI) {
			this.updateMultiPlayerMode();
		}
	}

	updateSinglePlayerMode() {
		if (State.get('gameData', 'phase') === GamePhases.RUNNING || State.get('gameData', 'phase') === GamePhases.COUNTDOWN) {
			if (this.keys.ArrowUp) {
				this.game.physics.leftPaddleY = Math.max(
					0, 
					this.game.physics.leftPaddleY - this.game.physics.paddleSpeed
				);
			}
			if (this.keys.ArrowDown) {
				this.game.physics.leftPaddleY = Math.min(
					this.game.canvas.height - this.game.physics.paddleHeight, 
					this.game.physics.leftPaddleY + this.game.physics.paddleSpeed
				);
			}
		}
	}

	updateMultiPlayerMode() {
		if (State.get('gameData', 'phase') === GamePhases.RUNNING || State.get('gameData', 'phase') === GamePhases.COUNTDOWN) {
			if (this.keys.w) {
				this.game.physics.leftPaddleY = Math.max(
					0, 
					this.game.physics.leftPaddleY - this.game.physics.paddleSpeed
				);
			}
			if (this.keys.s) {
				this.game.physics.leftPaddleY = Math.min(
					this.game.canvas.height - this.game.physics.paddleHeight, 
					this.game.physics.leftPaddleY + this.game.physics.paddleSpeed
				);
			}
			if (this.keys.ArrowUp) {
				this.game.physics.rightPaddleY = Math.max(
					0, 
					this.game.physics.rightPaddleY - this.game.physics.paddleSpeed
				);
			}
			if (this.keys.ArrowDown) {
				this.game.physics.rightPaddleY = Math.min(
					this.game.canvas.height - this.game.physics.paddleHeight, 
					this.game.physics.rightPaddleY + this.game.physics.paddleSpeed
				);
			}
		}
	}
}