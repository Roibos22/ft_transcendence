import { GamePhases } from '../constants.js';
import state from '../state/stateManager.js';

export class Tournament {
	constructor(game) {
		this.game = game;
		this.generateMatches();
	}

	generateMatches() {
		const matches = [];
		for (let i = 0; i < state.tournament.numberOfGames; i++) {
			for (let j = 0; j < state.players.length; j++) {
				for (let k = j + 1; k < state.players.length; k++) {
					matches.push({
						players: [
							{ ...state.players[j], score: 0 },
							{ ...state.players[k], score: 0 }
						],
						completed: false
					});
				}
			}
		}

		state.set('tournament.matches', matches);
	}

	getCurrentMatch() {
		return state.get('tournament.currentMatch');
	}

	getNextMatch() {
		return state.get('tournament.matches')[state.get('tournament.currentMatchIndex') + 1];
	}

	completeMatch() {
		const currentMatch = state.get('currentMatch');

		const winner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
		const loser = currentMatch.players[0] === winner ? currentMatch.players[1] : currentMatch.players[0];
		
		const players = state.get('tournament.players');

		players.find(p => p.name === winner.name).wins++;
		players.find(p => p.name === loser.name).losses++;
		players.find(p => p.name === winner.name).points += 2;
		players.find(p => p.name === loser.name).points += 0;

		state.set('tournament.players', players);

		currentMatch.completed = true;
	
		if (this.game.animationFrameId) {
			cancelAnimationFrame(this.game.animationFrameId);
			this.game.animationFrameId = null;
		}

		const currentMatchIndex = state.get('tournament.currentMatchIndex');

		if (currentMatchIndex >= state.get('matches').length - 1) {
			state.set('gamePhase', GamePhases.FINISHED);
		} else {
			state.set('gamePhase', GamePhases.MATCH_ENDED);
		}
		this.game.state.waitingForEnter = true;
		this.game.uiManager.updateUI();
	}

	getStandings() {
		return state.get('tournament.players')
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