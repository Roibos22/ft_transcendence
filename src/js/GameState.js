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
			this.gameFinished = false;
			this.waitingForEnter = false;
			const nextMatch = this.game.tournament.getCurrentMatch();
			nextMatch.players[0].score = 0;
			nextMatch.players[1].score = 0;
			this.game.uiManager.updateUI();
			this.game.startGame();
		} else {
			console.log("Tournament completed!");
		}
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