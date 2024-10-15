import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import * as gameService from '../services/api/gameService.js';
import Router from '../router.js';
import State from '../State.js';
import Socket from '../services/Socket.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;

		const tournament = State.get('tournament');
		const currentMatchIndex = tournament.currentMatchIndex;
		const matches = tournament.matches;

		this.game = new PongGame(matches[currentMatchIndex].socket);
		this.UIManager = new UIManager();
	}

	update() {
		if (this.UIManager) {
			this.UIManager.update();
		}
		this.updateTournamentData();
		if (this.checkGameFinished()) {
			this.handleGameFinished();
		}
	}

	// end game

	updateTournamentData() {
		const gameData = State.get('gameData');
		const tournament = State.get('tournament');
		const index = tournament.currentMatchIndex;
		
		const matches = tournament.matches;
		
		if (matches[index] && matches[index].players) {
			matches[index].players[0].score = gameData.player1Score;
			matches[index].players[1].score = gameData.player2Score;
		}
		
		State.data.tournament.matches = matches;
	}

	checkGameFinished() {
		const gameData = State.get('gameData');
		return gameData.phase === 'game_over';
	}

	handleGameFinished() {
		console.log("Handling game finish");
		const tournament = State.get('tournament');
		const matchIndex = tournament.currentMatchIndex;
		const currentMatch = tournament.matches[matchIndex];

		// Update match in tournament
		currentMatch.completed = true;
		
		// Update player stats
		this.updatePlayerStats(currentMatch);

		// Close socket
		if (currentMatch.socket) {
			currentMatch.socket.close();
		}

		// Clean up game resources
		if (this.game) {
			this.game.destroy();
			this.game = null;
		}

		// Clean up UI Manager
		if (this.UIManager) {
			this.UIManager.destroy();
			this.UIManager = null;
		}

		// Move to next match
		tournament.currentMatchIndex++;

		// Check if tournament is completed
		if (tournament.currentMatchIndex >= tournament.matches.length) {
			tournament.completed = true;
		}

		// Update tournament state
		State.set('tournament', tournament);

		// Navigate back to overview
		window.history.pushState({}, '', '/local-game-overview');
		Router.handleLocationChange();
	}

	updatePlayerStats(match) {
		const tournament = State.get('tournament');
		const player1 = tournament.players.find(p => p.name === match.players[0].name);
		const player2 = tournament.players.find(p => p.name === match.players[1].name);

		if (match.players[0].score > match.players[1].score) {
			player1.wins++;
			player2.losses++;
			player1.points += 3;
		} else if (match.players[0].score < match.players[1].score) {
			player2.wins++;
			player1.losses++;
			player2.points += 3;
		} else {
			player1.points++;
			player2.points++;
		}

		State.set('tournament', tournament);
	}


}
