import { GameModes, GameStates } from '../utils/shared.js';

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
        console.log("init input");
	}

	preventDefaultScroll(e) {
		if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
			e.preventDefault();
		}
	}

	handleKeyDown(e) {
        console.log("keystroke registered");
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
		if (this.game.tournamentSettings.mode === GameModes.SINGLE) {
			this.updateSinglePlayerMode();
		} else if (this.game.tournamentSettings.mode === GameModes.MULTI) {
			this.updateMultiPlayerMode();
		}
	}

	updateSinglePlayerMode() {
		if (this.game.state.currentState === GameStates.RUNNING || this.game.state.currentState === GameStates.COUNTDOWN) {
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
		if (this.game.state.currentState === GameStates.RUNNING || this.game.state.currentState === GameStates.COUNTDOWN) {
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