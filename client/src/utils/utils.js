import State from '../State.js';
import { GameModes } from '../constants.js';
import * as Notification from '../services/notification.js';

export function deepCopy(obj) {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(item => deepCopy(item));
	}

	const copy = {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			copy[key] = deepCopy(obj[key]);
		}
	}
	return copy;
}

export function incrementCurrentMatchIndex() {
	const currentMatchIndex = State.get('tournament.currentMatchIndex');
	State.set('tournament.currentMatchIndex', currentMatchIndex + 1);

	const matches = State.get('tournament.matches');
	State.set('tournament.currentMatch', matches[currentMatchIndex + 1]);
}

export function buttonIdToGameMode(id) {
	console.log(id);
	switch (id) {
		case 'btn_singleplayer':
			return GameModes.SINGLE;
		case 'btn_multiplayer':
			return GameModes.MULTI;
		case 'btn_online':
			return GameModes.ONLINE;
		default:
			return GameModes.SINGLE;
	}
}

export function standingsTableRow(player) {
	return `
		<tr>
			<td>${player.rank}</td>
			<td>${player.name}</td>
			<td>${player.wins}</td>
			<td>${player.losses}</td>
			<td>${player.points}</td>
		</tr>
	`;
}

export function generateMatches() {
	const matches = [];
	const tournament = State.get('tournament');

	for (let i = 0; i < tournament.numberOfGames; i++) {
		for (let j = 0; j < tournament.players.length; j++) {
			for (let k = j + 1; k < tournament.players.length; k++) {
				matches.push({
					players: [
						{ name: tournament.players[j].name, score: 0 },
						{ name: tournament.players[k].name, score: 0 }
					],
					completed: false,
					socket: null,
				});
			}
		}
	}

	State.set('tournament', 'matches', matches);
}

export function initPlayerStats() {
	var players = State.get("tournament", "players");

	players = players.map(player => ({
		...player,
		rank: 0,
		wins: 0,
		losses: 0,
		points: 0
	}));

	State.set("tournament", "players", players);
}

export function checkInput(input) {
	const name = input.value;
	const newName = name.replace(/[^a-zA-Z0-9 ]/g, '');

	if (newName !== name) {
		Notification.showErrorNotification('This field can only contain letters and numbers');
	}

	if(newName.length > 20) {
		Notification.showErrorNotification('This field can only be 20 characters long');
	}

	return newName.substring(0, 20);
}