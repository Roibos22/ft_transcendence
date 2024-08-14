class Tournament {
	constructor(players) {
		this.players = players;
		this.matches = this.generateMatches();
		this.currentMatchIndex = 0;
	}

	generateMatches() {
		return [this.players];
	}

	getCurrentMatch() {
		return this.matches[this.currentMatchIndex];
	}

}