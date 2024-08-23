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
			this.game.uiManager.updateScoreDisplay();
			this.game.tournament.updateScores();	// NEW
			this.game.startGame();
		} else {
			console.log("Tournament completed!");
		}
	}
}