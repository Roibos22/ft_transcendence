class Tournament {
	constructor(players) {
		this.players = players;
		this.settings = settings;
		this.matches = this.generateMatches();
		this.currentMatchIndex = 0;
		this.currentGameNumber = 1;
	}

	generateMatches() {
		const matches = [];
		for (let i = 0; i < this.players.length; i++) {
			for (let j = i + 1; j < this.players.length; j++) {
				matches.push({
					players: [
						{ ...this.players[i], score: 0, gamesWon: 0 },
						{ ...this.players[j], score: 0, gamesWon: 0 }
					],
					games: []
				});
			}
		}
		return matches;
	}

	getCurrentMatch() {
		return this.matches[this.currentMatchIndex];
	}

	updateScore(playerIndex) {
		const currentMatch = this.getCurrentMatch();
		currentMatch.players[playerIndex].score++;

		if (currentMatch.players[playerIndex].score >= this.settings.pointsToWin) {
			currentMatch.players[playerIndex].gamesWon++;
			currentMatch.games.push(currentMatch.players[playerIndex].name);
			
			if (currentMatch.games.length >= this.settings.numberOfGames) {
				this.currentMatchIndex++;
				this.currentGameNumber = 1;
				if (this.currentMatchIndex >= this.matches.length) {
					return 'tournament_end';
				}
				return 'match_end';
			} else {
				this.currentGameNumber++;
				return 'game_end';
			}
		}

		return 'continue';
	}

	getTournamentStandings() {
		const standings = {};
		this.players.forEach(player => standings[player.name] = 0);

		this.matches.forEach((match, index) => {
			if (index < this.currentMatchIndex || (index === this.currentMatchIndex && match.games.length > 0)) {
				match.games.forEach(winner => {
					standings[winner]++;
				});
			}
		});

		return Object.entries(standings)
			.sort((a, b) => b[1] - a[1])
			.map(([name, wins]) => `${name}: ${wins} wins`);
	}
}