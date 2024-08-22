class Tournament {
	constructor(players, settings) {
		this.players = players.map(player => ({ ...player, wins: 0, losses: 0, points: 0 }));
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
					],
					completed: false
				});
				console.log("created match");
			}
		}
		return matches;
	}

	getCurrentMatch() {
		return this.matches[this.currentMatchIndex];
	}

	completeMatch(match) {
		const winner = match.players[0].score > match.players[1].score ? match.players[0] : match.players[1];
		const loser = match.players[0] === winner ? match.players[1] : match.players[0];
		
		this.players.find(p => p.name === winner.name).wins++;
		this.players.find(p => p.name === loser.name).losses++;
		this.players.find(p => p.name === winner.name).points += 3;
		this.players.find(p => p.name === loser.name).points += 1;

		match.completed = true;


		this.currentMatchIndex++;
		if (this.currentMatchIndex >= this.matches.length) {
			// Tournament is over
			console.log("Tournament completed!");
		}
	}

	getStandings() {
		return this.players
			.sort((a, b) => b.points - a.points || (b.wins - b.losses) - (a.wins - a.losses))
			.map((player, index) => ({
				rank: index + 1,
				name: player.name,
				wins: player.wins,
				losses: player.losses,
				points: player.points
			}));
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