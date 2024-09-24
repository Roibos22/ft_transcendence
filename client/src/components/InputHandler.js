import { GameModes, GamePhases } from '../constants.js';
import { incrementCurrentMatchIndex } from '../utils/utils.js';
import state from '../State.js';

export default class InputHandler {
	constructor(game) {
		this.game = game;
	}

	init() {
		document.addEventListener('keydown', (e) => this.preventDefaultScroll(e));
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
				this.game.engine.player1.moveUp();
				break;
			case 's':
				this.game.engine.player1.moveDown();
				break;
			case 'ArrowUp':
				this.game.engine.player2.moveUp();
				break;
			case 'ArrowDown':
				this.game.engine.player2.moveDown();
				break;
			case 'Enter':
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
			if (state.get('gameData', 'phase') === GamePhases.MATCH_ENDED) {
				incrementCurrentMatchIndex();
				this.game.state.startNextMatch();
				this.game.state.startCountdown();
			} else if (state.get('gameData', 'phase') === GamePhases.FINISHED) {
				console.log("TOURNAMENT COMPLETED");
				// Add logic to restart the tournament or return to main menu
			} else {
				this.game.state.startCountdown();
			}
			this.game.state.waitingForEnter = false;
		}
	}

	update() {
		if (state.get('gameSettings', 'mode') === GameModes.SINGLE) {
			this.updateSinglePlayerMode();
		} else if (state.get('gameSettings', 'mode') === GameModes.MULTI) {
			this.updateMultiPlayerMode();
		}
	}

	updateSinglePlayerMode() {
		if (state.get('gameData', 'phase') === GamePhases.RUNNING || state.get('gameData', 'phase') === GamePhases.COUNTDOWN) {
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
		if (state.get('gameData', 'phase') === GamePhases.RUNNING || state.get('gameData', 'phase') === GamePhases.COUNTDOWN) {
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