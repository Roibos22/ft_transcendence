import { GamePhases } from '../constants.js';
import State from '../State.js';

export class Tournament {
	constructor() {
		this.generateMatches();
	}

	generateMatches() {
		const matches = [];
		const tournament = State.get('tournament');

		for (let i = 0; i < tournament.numberOfGames; i++) {
			for (let j = 0; j < tournament.players.length; j++) {
				for (let k = j + 1; k < tournament.players.length; k++) {
					matches.push({
						players: [
							{ ...tournament.players[j], score: 0 },
							{ ...tournament.players[k], score: 0 }
						],
						completed: false
					});
				}
			}
		}

		State.set('tournament', 'matches', matches);
	}

	getCurrentMatch() {
		return State.get('tournament', 'currentMatch');
	}

	getNextMatch() {
		return State.get('tournament', 'matches')[State.get('tournament', 'currentMatchIndex') + 1];
	}

	completeMatch() {
		const currentMatch = State.get('currentMatch');

		const winner = currentMatch.players[0].score > currentMatch.players[1].score ? currentMatch.players[0] : currentMatch.players[1];
		const loser = currentMatch.players[0] === winner ? currentMatch.players[1] : currentMatch.players[0];
		
		const players = State.get('tournament', 'players');

		players.find(p => p.name === winner.name).wins++;
		players.find(p => p.name === loser.name).losses++;
		players.find(p => p.name === winner.name).points += 2;
		players.find(p => p.name === loser.name).points += 0;

		State.set('tournament', 'players', players);

		currentMatch.completed = true;
	
		if (this.game.animationFrameId) {
			cancelAnimationFrame(this.game.animationFrameId);
			this.game.animationFrameId = null;
		}

		const currentMatchIndex = State.get('tournament', 'currentMatchIndex');

		if (currentMatchIndex >= State.get('matches').length - 1) {
			State.set('gameData', 'phase', GamePhases.FINISHED);
		} else {
			State.set('gameData', 'phase', GamePhases.MATCH_ENDED);
		}
		this.game.State.waitingForEnter = true;
		this.game.uiManager.updateUI();
	}

	static getStandings() {
		return State.get('tournament', 'players')
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