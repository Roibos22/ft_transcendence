class GameState {
	constructor(game) {
		this.game = game;

		this.isGameRunning = false;
		this.waitingForSpaceBar = true;
		this.waitingForEnter = false;
		this.gameFinished = false
	}

	startNextMatch() {
		if (this.game.tournament.currentMatchIndex < this.game.tournament.matches.length) {
			this.resetMatchState();
			this.game.physics.resetBallPosition();
			this.game.uiManager.updateUI();
		} else {
			console.log("Tournament completed!");
			this.gameFinished = true;
		}
	}

	resetMatchState() {
		this.gameFinished = false;
		this.waitingForEnter = false;
		this.waitingForSpaceBar = true;
		this.isGameRunning = false;
	}

	pointScored() {
		this.waitingForSpaceBar = true;
		this.isGameRunning = false;
		this.game.physics.resetBallPosition();
		this.checkIfMatchWon()
		this.game.uiManager.updateUI();
	}

	checkIfMatchWon() {
		const currentMatch = this.game.tournament.getCurrentMatch();

		if (currentMatch.players[0].score >= this.game.tournamentSettings.pointsToWin || 
			currentMatch.players[1].score >= this.game.tournamentSettings.pointsToWin) {
			this.isGameRunning = false;
			this.waitingForSpaceBar = false;
			this.waitingForEnter = true;
			this.gameFinished = true;
			this.game.render.draw();
			this.game.tournament.completeMatch(currentMatch);
			this.game.uiManager.updateUI();
		}
	}

}