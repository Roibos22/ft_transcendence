class Game {
	constructor() {
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

		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.ballRadius = 5;

		this.leftPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
		this.ballSpeedX = 8;
		this.ballSpeedY = 8;

		this.isGameRunning = false;
		this.waitingForSpaceBar = true;
		this.waitingForEnter = false;
		this.gameFinished = false

		this.players = [];
		this.tournament = null;

		this.render = new Render(this);
		this.input = new Input(this);

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
		this.resetBallPosition();
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
			this.movePaddles();
			this.moveBall();
			this.checkCollision();
			this.render.draw();
		}
		console.log("draw game")
		requestAnimationFrame(() => this.gameLoop());
	}

	movePaddles() {
		this.leftPaddleY = Math.max(Math.min(this.leftPaddleY, this.canvas.height - this.paddleHeight), 0);
		this.rightPaddleY = Math.max(Math.min(this.rightPaddleY, this.canvas.height - this.paddleHeight), 0);
	}

	moveBall() {
		this.ballX += this.ballSpeedX;
		this.ballY += this.ballSpeedY;

		if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvas.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

		if (this.ballX < 0) {
			this.tournament.getCurrentMatch().players[1].score++;
			this.waitingForSpaceBar = true;
			this.isGameRunning = false;
			this.resetBallPosition();
			this.updateStandings();
		} else if (this.ballX > this.canvas.width) {
			this.tournament.getCurrentMatch().players[0].score++;
			this.waitingForSpaceBar = true;
			this.isGameRunning = false;
			this.resetBallPosition();
			this.updateStandings();
		}
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

			// // Display who won and next game (or tournament end) in gameCanvas
			// const winner = currentMatch.players[0].score > currentMatch.players[1].score ? 
			// currentMatch.players[0] : currentMatch.players[1];
			// this.ctx.fillStyle = 'white';
			// this.ctx.font = '24px Arial';
			// this.ctx.fillText(`${winner.name} wins!`, this.canvas.width / 2 - 50, this.canvas.height / 2 - 30);
				
			// if (this.tournament.currentMatchIndex < this.tournament.matches.length) {
			// 	this.ctx.fillText('Press Enter for next match', this.canvas.width / 2 - 100, this.canvas.height / 2 + 30);
			// } else {
			// 	this.ctx.fillText('Tournament Completed!', this.canvas.width / 2 - 100, this.canvas.height / 2 + 30);
			// }
		}



		// show who won and next game (or restart) in gameCanvas

		// press enter to continue to next game
	}

	resetBallPosition() {
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
	}

	checkCollision() {
		if (this.ballX - this.ballRadius < this.paddleWidth && this.ballY > this.leftPaddleY && this.ballY < this.leftPaddleY + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		}
		if (this.ballX + this.ballRadius > this.canvas.width - this.paddleWidth && this.ballY > this.rightPaddleY && this.ballY < this.rightPaddleY + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
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
        // You might want to display a final tournament summary or restart option here
    }
}

	// startNextGame() {
	// 	const currentMatch = this.tournament.getCurrentMatch();
	// 	currentMatch.players[0].score = 0;
	// 	currentMatch.players[1].score = 0;
	// 	this.updateScoreDisplay();
	// 	this.startGame();
	// }
}
