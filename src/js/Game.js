class Game {
	constructor() {
		this.render = new Render(this);
		this.input = new Input(this);
		this.physics = new GamePhysics(this);

		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.gameSetupView = document.getElementById('gameSetupView');
		this.playerForm = document.getElementById('playerForm');
		this.gameView = document.getElementById('gameView');
		this.settingsView = document.getElementById('settingsView');
		this.playerInfo = document.getElementById('playerInfo');
		this.tournamentInfo = document.getElementById('tournamentInfo');
		this.tournamentInfoMatches = document.getElementById('tournamentInfoMatches');
		this.tournamentInfoStandings = document.getElementById('tournamentInfoStandings');

		this.isGameRunning = false;
		this.waitingForSpaceBar = true;
		this.waitingForEnter = false;
		this.gameFinished = false

		this.players = [];
		this.tournament = null;

		this.tournamentSettings = {
			pointsToWin: 5,
			numberOfGames: 1
		};
	}

	init() {
		document.getElementById('startGame').addEventListener('click', (e) => this.handleFormSubmit(e));
		console.log('Starting the game!');
		this.input.init();
	}

	handleFormSubmit(e) {
		e.preventDefault();

		const playerInputs = document.querySelectorAll('#playerInputs input');

		playerInputs.forEach((input, index) => {
			const playerName = input.value.trim() || `Player ${index + 1}`;
			this.players.push({
				name: playerName,
				score: 0
			});
		});

		while (this.players.length < 2) {
			this.players.push({
				name: `Player ${this.players.length + 1}`,
				score: 0
			});
		}

		this.gameSetupView.style.display = 'none';
		this.settingsView.style.display = 'none';
		this.gameView.style.display = 'block';

		this.tournament = new Tournament(this.players, this.tournamentSettings);
		this.startGame()
	}

	startGame() {
		this.waitingForSpaceBar = true;
		this.isGameRunning = false;
		this.physics.resetBallPosition();
		this.updateScoreDisplay();
		this.render.draw();
		this.gameLoop();
	}

	updateScoreDisplay() {
		const currentMatch = this.tournament.getCurrentMatch();
		const tournamentInfo = document.getElementById('tournamentInfo');
		console.log("current match: ", currentMatch.players[0])
		this.playerInfo.textContent = `${currentMatch.players[0].name} (${currentMatch.players[0].score}) vs ${currentMatch.players[1].name} (${currentMatch.players[1].score})`;
		this.updateTournamentInfo()
	}

	updateTournamentInfo() {
		this.tournamentInfo.textContent = 'Tournament';
		// Update matches
		const matchesList = this.tournament.matches.map((match, index) => {
			const player1 = match.players[0].name;
			const player2 = match.players[1].name;
			if (match.completed) {
				return `${player1} ${match.players[0].score} - ${match.players[1].score} ${player2} (Completed)`;
			} else if (index === this.tournament.currentMatchIndex) {
				return `${player1} vs ${player2} (Current Match)`;
			} else {
				return `${player1} vs ${player2} (Upcoming)`;
			}
		}).join('<br>');
		this.tournamentInfoMatches.innerHTML = `<strong>All Matches:</strong><br>${matchesList}`;
	
		// Update standings
		const standings = this.tournament.getStandings();
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
		this.tournamentInfoStandings.innerHTML = `<strong>Standings:</strong><br>${standingsTable}`;

	}

	gameLoop() {
		if (this.isGameRunning) {
			this.physics.movePaddles();
			this.physics.moveBall();
			this.physics.checkCollision();
			this.render.draw();
		}
		console.log("draw game")
		requestAnimationFrame(() => this.gameLoop());
	}

	updateStandings() {
		this.updateScoreDisplay();
		const currentMatch = this.tournament.getCurrentMatch();

		if (currentMatch.players[0].score >= this.tournamentSettings.pointsToWin || 
			currentMatch.players[1].score >= this.tournamentSettings.pointsToWin) {
			console.log("Game OVER!");
			this.isGameRunning = false;
			this.waitingForSpaceBar = false;
			this.waitingForEnter = true;
			this.gameFinished = true;

			this.tournament.completeMatch(currentMatch);
			this.updateTournamentInfo();
			this.render.draw();

		}

	}

	startNextMatch() {
		if (this.tournament.currentMatchIndex < this.tournament.matches.length) {
			this.gameFinished = false;
			this.waitingForEnter = false;
			const nextMatch = this.tournament.getCurrentMatch();
			nextMatch.players[0].score = 0;
			nextMatch.players[1].score = 0;
			this.updateScoreDisplay();
			this.startGame();
		} else {
			console.log("Tournament completed!");
		}
	}

}
