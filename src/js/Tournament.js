class Tournament {
	constructor(game, players, settings) {
		this.game = game;
		this.players = players.map(player => ({ ...player, wins: 0, losses: 0, points: 0 }));
		this.settings = settings;
		this.matches = this.generateMatches();
		this.currentMatchIndex = 0;
		this.currentGameNumber = 1;
	}

	generateMatches() {
		const matches = [];
		for (let i = 0; i < this.game.tournamentSettings.numberOfGames; i++) {
			for (let j = 0; j < this.players.length; j++) {
				for (let k = j + 1; k < this.players.length; k++) {
					matches.push({
						players: [
							{ ...this.players[j], score: 0 },
							{ ...this.players[k], score: 0 }
						],
						completed: false
					});
				}
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
		this.players.find(p => p.name === winner.name).points += 2;
		this.players.find(p => p.name === loser.name).points += 0;
		match.completed = true;

		if (this.game.animationFrameId) {
			cancelAnimationFrame(this.game.animationFrameId);
			this.game.animationFrameId = null;
		}
		this.game.state.isGameRunning = false;

	}

	updateScores(match, indexPlayerScored) {
		//match.players[indexPlayerScored].score++;
		this.game.uiManager.updateTournamentInfo();
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
}