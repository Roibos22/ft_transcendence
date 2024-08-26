class UIManager {
	constructor(game) {
		this.game = game;
	}

	updateUI() {
		this.updateScoreHeader()
		this.updateMatchList();
		this.updateTable();
	}

	updateScoreHeader() {
		const currentMatch = this.game.tournament.getCurrentMatch();
		const player1 = currentMatch.players[0];
		const player2 = currentMatch.players[1];
	
		this.game.playerInfo.innerHTML = `
			<div class="container px-0" style="max-width: 1000px;">
				<div class="card mb-3">
					<div class="card-header bg-dark text-white text-center">
						<h5 class="mb-0">Current Match</h5>
					</div>
					<div class="card-body">
						<div class="d-flex justify-content-between align-items-center flex-wrap">
							<span class="h5 mb-0 me-2">${player1.name}</span>
							<span class="badge bg-primary fs-6 me-2">${player1.score}</span>
							<span class="badge bg-secondary fs-6 mx-2">VS</span>
							<span class="badge bg-primary fs-6 ms-2">${player2.score}</span>
							<span class="h5 mb-0 ms-2">${player2.name}</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	updateMatchList() {
		const matchesList = this.game.tournament.matches.map((match, index) => {
			const player1 = match.players[0].name;
			const player2 = match.players[1].name;
			let matchClass = 'list-group-item';
			let matchContent = '';
	
			if (match.completed) {
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<span>${player1} vs ${player2}</span>
						<span class="badge bg-secondary ms-3 fs-6">${match.players[0].score}:${match.players[1].score}</span>
					</div>`;
			} else if (index === this.game.tournament.currentMatchIndex) {
				matchClass += ' active';
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<strong>${player1} vs ${player2}</strong>
						<span class="badge bg-primary ms-3 fs-6">${match.players[0].score}:${match.players[1].score}</span>
					</div>`;
			} else {
				matchContent = `
					<div class="d-flex justify-content-between align-items-center">
						<span>${player1} vs ${player2}</span>
						<span class="invisible">Placeholder</span>
					</div>`;
			}
			return `<li class="${matchClass}">${matchContent}</li>`;
		}).join('');
	
		this.game.tournamentInfoMatches.innerHTML = `
			<div class="card">
				<div class="card-header bg-dark text-white text-center">
					<h5 class="mb-0">Matches</h5>
				</div>
				<ul class="list-group list-group-flush">
					${matchesList}
				</ul>
			</div>
		`;
	}

	updateTable() {
		const standings = this.game.tournament.getStandings();
		const standingsTable = `
			<div class="table-responsive">
				<table class="table table-striped mb-0 text-center">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Wins</th>
							<th>Losses</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						${standings.map(player => `
							<tr>
								<td>${player.rank}</td>
								<td>${player.name}</td>
								<td>${player.wins}</td>
								<td>${player.losses}</td>
								<td>${player.points}</td>
							</tr>
						`).join('')}
					</tbody>
				</table>
			</div>
		`;
	
		this.game.tournamentInfoStandings.innerHTML = `
			<div class="card">
				<div class="card-header bg-dark text-white text-center">
					<h5 class="mb-0">Standings</h5>
				</div>
				<div class="card-body p-0">
					${standingsTable}
				</div>
			</div>
		`;
	}

}