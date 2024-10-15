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
		if (gameData.phase === 'game_over') {
			console.log("Game finished");
			return true;
		}
		return false;
	}

	handleGameFinished() {
		console.log("Handling game finish");

		// update match in tournament
		// navigate back to overview
		// close socket
		// update standings
		// go to next game
		// prepare next game

		// const gameData = State.get('gameData');
		// const matchResult = {
		// 	player1_name: gameData.constants.player1Username,
		// 	player2_name: gameData.constants.player2Username,
		// 	player1_score: gameData.player1Score,
		// 	player2_score: gameData.player2Score
		// };
		// this.handleMatchComplete(matchResult);
	}


}
