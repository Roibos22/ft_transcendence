import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import { GameModes } from '../constants.js';
import Router from '../Router.js';
import State from '../State.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIManager = null;
		this.isHandlingGameFinish = false;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;
		this.setupGame();
	}

	setupGame() {
		const tournament = State.get('tournament');
		const currentMatchIndex = tournament.currentMatchIndex;
		const matches = tournament.matches;

		if (currentMatchIndex < matches.length) {
			this.game = new PongGame(matches[currentMatchIndex].socket);
			this.UIManager = new UIManager();
		} else {
			this.navigateToOverview();
		}
	}

	update() {
		if (this.UIManager) {
			this.UIManager.update();
		}
		if (!this.isHandlingGameFinish) {
			this.updateTournamentData();
			if (this.checkGameFinished()) {
				this.handleGameFinished();
			}
		}
	}

	// end game

	updateTournamentData() {
		const gameData = State.get('gameData');
		const tournament = State.get('tournament');
		const index = tournament.currentMatchIndex;
		
		if (tournament.matches[index] && tournament.matches[index].players) {
			const updatedMatches = [...tournament.matches];
			updatedMatches[index] = {
				...updatedMatches[index],
				players: [
					{ ...updatedMatches[index].players[0], score: gameData.player1Score },
					{ ...updatedMatches[index].players[1], score: gameData.player2Score }
				]
			};
			State.data.tournament.matches = updatedMatches;
			//State.set('tournament', { ...tournament, matches: updatedMatches });
		}
	}

	checkGameFinished() {
		const gameData = State.get('gameData');
		return gameData.phase === 'game_over';
	}

	handleGameFinished() {
		if (this.isHandlingGameFinish) return;
		this.isHandlingGameFinish = true;

		this.UIManager.update();
		const tournament = State.get('tournament');
		const matchIndex = tournament.currentMatchIndex;
		const currentMatch = tournament.matches[matchIndex];

		const updatedMatches = [...tournament.matches];
		updatedMatches[matchIndex] = { ...currentMatch, completed: true };
		
		const updatedPlayers = this.calculateUpdatedPlayerStats(tournament.players, currentMatch);

		const wasLastMatch = matchIndex + 1 >= tournament.matches.length;
		const updatedTournament = {
			...tournament,
			matches: updatedMatches,
			players: updatedPlayers,
			currentMatchIndex: wasLastMatch ? matchIndex : matchIndex + 1,
			completed: wasLastMatch
		};

		State.set('tournament', updatedTournament);

		if (State.get('gameSettings', 'mode') != "online") {
			this.navigateToOverview();
		}

		this.isHandlingGameFinish = false;
	}

	navigateToOverview() {
		window.history.pushState({}, '', '/local-game-overview');
		Router.handleLocationChange();
	}

	calculateUpdatedPlayerStats(players, match) {
		return players.map(player => {
			const matchPlayer = match.players.find(p => p.name === player.name);
			if (!matchPlayer) return player;

			const opponentScore = match.players.find(p => p.name !== player.name).score;
			const playerWon = matchPlayer.score > opponentScore;
			const isDraw = matchPlayer.score === opponentScore;

			return {
				...player,
				wins: player.wins + (playerWon ? 1 : 0),
				losses: player.losses + (playerWon ? 0 : isDraw ? 0 : 1),
				points: player.points + (playerWon ? 3 : isDraw ? 1 : 0)
			};
		});
	}

	cleanup() {
		if (this.game && State.get('gameSettings', 'mode') !== GameModes.ONLINE) {
			this.game.destroy();
			this.game = null;
		}
	}
}
