import { GamePhases } from '../constants.js';
import state from '../State.js';

export class GameState {
	constructor(game) {
		this.game = game;
		this.countdownValue = 3;
		this.waitingForEnter = true;

		state.set('gamePhase', GamePhases.WAITING_TO_START);
	}

	startOrResumeGame() {
		state.set('gamePhase', GamePhases.RUNNING);
	}

	startCountdown() {
		state.set('gamePhase', GamePhases.COUNTDOWN);
		this.countdownValue = 3;
		this.countdownInterval = setInterval(() => {
			this.countdownValue--;
			if (this.countdownValue === 0) {
				clearInterval(this.countdownInterval);
				this.isCountingDown = false;
				this.startOrResumeGame();
			}
			this.game.render.draw();
		}, 1000);
	}

	startNextMatch() {
		if (state.get('tournament.currentMatchIndex') < state.get('tournament.matches').length) {
			this.resetMatchState();
			this.game.physics.resetBallPosition();
			this.game.uiManager.updateUI();
		} else {
			state.set('gamePhase', GamePhases.FINISHED);
			this.game.uiManager.updateUI();
		}
	}

	resetMatchState() {
		state.set('gamePhase', GamePhases.WAITING_TO_START);
		this.game.physics.resetPaddles();
		this.waitingForEnter = true;
	}

	pointScored() {
		this.game.physics.resetBallPosition();
		this.checkIfMatchWon();
		this.game.uiManager.updateUI();

		const gamePhase = state.get('gamePhase');
		if (gamePhase !== GamePhases.MATCH_ENDED && gamePhase !== GamePhases.FINISHED) {
			this.startCountdown();
		}
	}

	checkIfMatchWon() {
		const currentMatch = state.get('tournament.currentMatch');

		if (currentMatch.players[0].score >= this.game.tournamentSettings.pointsToWin || 
			currentMatch.players[1].score >= this.game.tournamentSettings.pointsToWin) {
			state.set('gamePhase', GamePhases.MATCH_ENDED);
			this.waitingForEnter = true;
			this.game.render.draw();
			this.game.tournament.completeMatch();
			this.game.uiManager.updateUI();
		}
	}

}