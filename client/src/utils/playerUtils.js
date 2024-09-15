import state from '../State.js';
import { GameModes } from '../constants.js';

export function addPlayer() {
	const playerInputs = document.getElementById('playerInputs');
	if (!playerInputs) {
		console.error('Player inputs container not found');
		return;
	}
	const playerCount = playerInputs.children.length + 1;
	const newPlayerDiv = document.createElement('div');
	newPlayerDiv.className = 'player-input-group mb-3';
	newPlayerDiv.innerHTML = `
		<div class="input-group">
			<input type="text" class="form-control form-input" id="player${playerCount}" placeholder="Player ${playerCount}" autocomplete=off>
			<button type="button" class="btn btn-danger fw-bold">X</button>
		</div>
	`;
	playerInputs.appendChild(newPlayerDiv);
	updatePlayers();
}

export function deletePlayer(button) {
	const playerInputGroup = button.closest('.player-input-group');
	if (playerInputGroup) {
		const playerInputs = document.getElementById('playerInputs');
		if (playerInputs && playerInputs.children.length > 1) {
			playerInputGroup.remove();
			renumberPlayers();
			updatePlayers();
		}
	} else {
		console.error('Could not find parent .player-input-group');
	}
}

export function renumberPlayers() {
	const playerInputs = document.getElementById('playerInputs');
	if (playerInputs) {
		const inputGroups = playerInputs.querySelectorAll('.player-input-group');
		inputGroups.forEach((group, index) => {
			const input = group.querySelector('input');
			if (input) {
				input.id = `player${index + 1}`;
				input.placeholder = `Player ${index + 1}`;
			}
		});
	}
}

export function updatePlayers() {
	const players = [];
	const playerInputs = document.querySelectorAll('#playerInputs input');
	playerInputs.forEach((input, index) => {
		const playerName = input.value.trim() || `Player ${index + 1}`;
		players.push({
			name: playerName,
			score: 0
		});
	});
	if (state.get('gameSettings', 'mode') === GameModes.SINGLE && players.length === 1) {
		players.push({
			name: "AI Player",
			score: 0
		});
	}
	state.set('currentMatchInfo', 'players', players);
}

export function deleteAllPlayersButOne() {
	const playerInputs = document.getElementById('playerInputs');
	if (playerInputs) {
		while (playerInputs.children.length > 1) {
			playerInputs.removeChild(playerInputs.lastChild);
		}
	}
}
