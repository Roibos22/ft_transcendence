import { GameModes, GamePhases } from '../constants.js';
import { incrementCurrentMatchIndex } from '../utils/utils.js';
import state from '../State.js';

export class Input {
	constructor(game) {
		this.game = game;
		this.keys = {
			w: false,
			s: false,
			ArrowUp: false,
			ArrowDown: false
		};
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