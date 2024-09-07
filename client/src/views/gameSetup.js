import { players, settings, GameModes } from '../utils/shared.js';
import { loadTemplate } from '../router.js';

export async function initGameSetupView() {
	const content = await loadTemplate('game-setup');
	document.getElementById('app').innerHTML = content;

	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const multiPlayerBtn = document.getElementById('btn_multiplayer');
	const addPlayerButton = document.getElementById('addPlayer');
	const playerInputsContainer = document.getElementById('playerInputs');
	const decreasePointsToWin = document.getElementById('decreasePointsToWin');

	if (singlePlayerBtn && multiPlayerBtn) {
		singlePlayerBtn.addEventListener('change', updateUIForGameMode);
		multiPlayerBtn.addEventListener('change', updateUIForGameMode);
	}

	if (addPlayerButton) {
		addPlayerButton.addEventListener('click', addPlayer);
	}

	if (playerInputsContainer) {
		playerInputsContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('btn-danger')) {
				deletePlayer(e.target);
			}
		});
	}

	document.querySelectorAll('.btn-outline-secondary').forEach(button => {
		button.addEventListener('click', (e) => {
			const setting = e.target.closest('.input-group').querySelector('.form-control').id.replace('Display', '');
			const change = e.target.textContent === '+' ? 1 : -1;
			updateValue(setting, change);
		});
	});

	initSettingsUI();
	updateUIForGameMode();
	updatePlayers();
}

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
			<input type="text" class="form-control" id="player${playerCount}" placeholder="Player ${playerCount}">
			<button type="button" class="btn btn-danger">X</button>
		</div>
	`;
	playerInputs.appendChild(newPlayerDiv);
	updatePlayers();
}

export function deletePlayer(button) {
	const playerInputGroup = button.closest('.player-input-group');
	if (playerInputGroup) {
		const playerInputs = document.getElementById('playerInputs');
		if (playerInputs.children.length > 1) {
			playerInputGroup.remove();
			renumberPlayers();
			updatePlayers();
		}
	} else {
		console.error('Could not find parent .player-input-group');
	}
}

function renumberPlayers() {
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
	players.length = 0;
	const playerInputs = document.querySelectorAll('#playerInputs input');
	playerInputs.forEach((input, index) => {
		const playerName = input.value.trim() || `Player ${index + 1}`;
		players.push({
			name: playerName,
			score: 0
		});
	});
	if (settings.mode === GameModes.SINGLE && players.length === 1) {
		players.push({
			name: "AI Player",
			score: 0
		});
	}
}

function deleteAllPlayersButOne() {
	const playerInputs = document.getElementById('playerInputs');
	if (playerInputs) {
		while (playerInputs.children.length > 1) {
			playerInputs.removeChild(playerInputs.lastChild);
		}
	}
}

function updateUIForGameMode() {
	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const multiPlayerBtn = document.getElementById('btn_multiplayer');
	const addPlayerButton = document.getElementById('addPlayer');

	if (singlePlayerBtn && singlePlayerBtn.checked) {
		deleteAllPlayersButOne();
		if (addPlayerButton) addPlayerButton.style.display = 'none';
		settings.mode = GameModes.SINGLE;
	} else if (multiPlayerBtn && multiPlayerBtn.checked) {
		addPlayer();
		if (addPlayerButton) addPlayerButton.style.display = 'block';
		settings.mode = GameModes.MULTI;
	}
	updatePlayers();
}

function initSettingsUI() {
	const settingsElements = {
		pointsToWin: document.getElementById('pointsToWinDisplay'),
		numberOfGames: document.getElementById('numberOfGamesDisplay')
	};

	for (const [key, element] of Object.entries(settingsElements)) {
		if (element) {
			element.textContent = settings[key];
		} else {
			console.error(`Element for ${key} not found`);
		}
	}
}

export function updateValue(setting, change) {
	const display = document.getElementById(`${setting}Display`);
	if (!display) {
		console.error(`Display element for ${setting} not found`);
		return;
	}

	let value = parseInt(display.textContent) + change;
	value = Math.max(1, value); // Ensure the value doesn't go below 1
	display.textContent = value;
	settings[setting] = value;
}