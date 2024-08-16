class Tournament {
	constructor(players, settings) {
		this.players = players;
		this.settings = settings;
		this.matches = this.generateMatches();
		this.currentMatchIndex = 0;
		this.currentGameNumber = 1;
	}

	generateMatches() {
		console.log("creating match");
		const matches = [];
		for (let i = 0; i < this.players.length; i++) {
			for (let j = i + 1; j < this.players.length; j++) {
				matches.push({
					players: [
						{ ...this.players[i], score: 0 },
						{ ...this.players[j], score: 0 }
					]
				});
				console.log("created match");
			}
		}
		return matches;
	}

	getCurrentMatch() {
		return this.matches[this.currentMatchIndex];
	}

	// updateScore(playerIndex) {
	// 	const currentMatch = this.getCurrentMatch();
	// 	currentMatch.players[playerIndex].score++;

	// 	if (currentMatch.players[playerIndex].score >= this.settings.pointsToWin) {
	// 		currentMatch.players[playerIndex].gamesWon++;
	// 		currentMatch.games.push(currentMatch.players[playerIndex].name);
			
	// 		if (currentMatch.games.length >= this.settings.numberOfGames) {
	// 			this.currentMatchIndex++;
	// 			this.currentGameNumber = 1;
	// 			if (this.currentMatchIndex >= this.matches.length) {
	// 				return 'tournament_end';
	// 			}
	// 			return 'match_end';
	// 		} else {
	// 			this.currentGameNumber++;
	// 			return 'game_end';
	// 		}
	// 	}

	// 	return 'continue';
	// }

	// getTournamentStandings() {
	// 	const standings = {};
	// 	this.players.forEach(player => standings[player.name] = 0);

	// 	this.matches.forEach((match, index) => {
	// 		if (index < this.currentMatchIndex || (index === this.currentMatchIndex && match.games.length > 0)) {
	// 			match.games.forEach(winner => {
	// 				standings[winner]++;
	// 			});
	// 		}
	// 	});

	// 	return Object.entries(standings)
	// 		.sort((a, b) => b[1] - a[1])
	// 		.map(([name, wins]) => `${name}: ${wins} wins`);
	// }

	// resetCurrentMatch() {
	// 	const currentMatch = this.getCurrentMatch();
	// 	currentMatch.players.forEach(player => {
	// 		player.score = 0;
	// 	});
	// }

	// getMatchResults() {
	// 	return this.matches.map(match => ({
	// 		players: match.players.map(p => p.name),
	// 		games: match.games,
	// 		winner: match.games.length > 0 ? 
	// 			(match.games.filter(g => g === match.players[0].name).length > match.games.filter(g => g === match.players[1].name).length ? 
	// 				match.players[0].name : match.players[1].name) : 
	// 			null
	// 	}));
	// }
}