const GameStates = {
	WAITING_TO_START: 'waitingToStart',
	COUNTDOWN: 'countdown',
	RUNNING: 'running',
	FINISHED: 'finished',
	MATCH_ENDED: 'matchEnded'
};

class GameState {
	constructor(game) {
		this.game = game;
		this.currentState = GameStates.WAITING_TO_START;
		this.countdownValue = 3;
		this.waitingForEnter = true;
	}

	startOrResumeGame() {
		this.currentState = GameStates.RUNNING;
	}

	startCountdown() {
		this.currentState = GameStates.COUNTDOWN;
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
		if (this.game.tournament.currentMatchIndex < this.game.tournament.matches.length) {
			this.resetMatchState();
			this.game.physics.resetBallPosition();
			this.game.uiManager.updateUI();
		} else {
			this.currentState = GameStates.FINISHED;
			this.game.uiManager.updateUI();
		}
	}

	resetMatchState() {
		this.currentState = GameStates.WAITING_TO_START;
		this.game.physics.resetPaddles();
		this.waitingForEnter = true;
	}

	pointScored() {
		this.game.physics.resetBallPosition();
		this.checkIfMatchWon();
		this.game.uiManager.updateUI();

		if (this.currentState !== GameStates.MATCH_ENDED && this.currentState !== GameStates.FINISHED) {
			this.startCountdown();
		}
	}

	checkIfMatchWon() {
		const currentMatch = this.game.tournament.getCurrentMatch();

		if (currentMatch.players[0].score >= this.game.tournamentSettings.pointsToWin || 
			currentMatch.players[1].score >= this.game.tournamentSettings.pointsToWin) {
			this.currentState = GameStates.MATCH_ENDED;
			this.waitingForEnter = true;
			this.game.render.draw();
			this.game.tournament.completeMatch(currentMatch);
			this.game.uiManager.updateUI();
		}
	}

}