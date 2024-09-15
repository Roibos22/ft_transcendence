import state from '../State.js';

export default class GameInfoSubscribers {
    updateScoreCard(view) {
        const tournament = state.get('tournament');
        if (!tournament) {
            console.error("Tournament not initialized");
            return;
        }

        const currentMatch = tournament.currentMatch;
        if (!currentMatch || !currentMatch.players || currentMatch.players.length < 2) {
            console.error("Invalid current match data");
            return;
        }

        const player1 = currentMatch.players[0];
        const player2 = currentMatch.players[1];
    
        view.scoreCard.player1Name.innerHTML = player1.name;
        view.scoreCard.player2Name.innerHTML = player2.name;
        view.scoreCard.player1Score.innerHTML = player1.score;
        view.scoreCard.player2Score.innerHTML = player2.score;
    }

    updateFixtures(view) {
        const tournament = state.get('tournament');
        const matchesList = tournament.matches.map((match, index) => {
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
			} else if (index === tournament.currentMatchIndex) {
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

        view.fixtures.innerHTML = `
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

    updateStandings(view) {
		const standings = view.tournament.getStandings();
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
	
		view.fixtures.innerHTML = `
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
