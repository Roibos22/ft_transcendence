class UIManager {
	constructor(game) {
		this.game = game;
	}

	updateStandings() {
		console.log("updateStandings");
		this.updateScoreDisplay();
		const currentMatch = this.game.tournament.getCurrentMatch();

		if (currentMatch.players[0].score >= this.game.tournamentSettings.pointsToWin || 
			currentMatch.players[1].score >= this.game.tournamentSettings.pointsToWin) {
			this.game.state.isGameRunning = false;
			this.game.state.waitingForSpaceBar = false;
			this.game.state.waitingForEnter = true;
			this.game.state.gameFinished = true;
			this.game.render.draw();
			this.game.tournament.completeMatch(currentMatch);
			this.updateTournamentInfo();
		}
	}

	updateScoreDisplay() {
		console.log("updateStandings");
		const currentMatch = this.game.tournament.getCurrentMatch();
		this.game.playerInfo.textContent = `${currentMatch.players[0].name} (${currentMatch.players[0].score}) vs ${currentMatch.players[1].name} (${currentMatch.players[1].score})`;
		this.updateTournamentInfo()
		
	}

	updateTournamentInfo() {
		console.log("updateTournamentInfo");
		this.game.tournamentInfo.textContent = 'Tournament';
		this.updateMatchList();
		this.updateTable();
	}

	updateMatchList() {
		const matchesList = this.game.tournament.matches.map((match, index) => {
			const player1 = match.players[0].name;
			const player2 = match.players[1].name;
			if (match.completed) {
				return `${player1} vs ${player2} ${match.players[0].score}:${match.players[1].score}`;
			} else if (index === this.game.tournament.currentMatchIndex) {
				return `<strong>${player1} vs ${player2} ${match.players[0].score}:${match.players[1].score}</strong>`;
			} else {
				return `${player1} vs ${player2}`;
			}
		}).join('<br>');
		this.game.tournamentInfoMatches.innerHTML = `<strong>Matches:</strong><br>${matchesList}`;
	}

	updateTable() {
		const standings = this.game.tournament.getStandings();
		const standingsTable = `
			<table border="1">
				<tr>
					<th>Rank</th>
					<th>Name</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>Points</th>
				</tr>
				${standings.map(player => `
					<tr>
						<td>${player.rank}</td>
						<td>${player.name}</td>
						<td>${player.wins}</td>
						<td>${player.losses}</td>
						<td>${player.points}</td>
					</tr>
				`).join('')}
			</table>
		`;
		this.game.tournamentInfoStandings.innerHTML = `<strong>Standings:</strong><br>${standingsTable}`;
	}

}