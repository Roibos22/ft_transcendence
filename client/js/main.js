document.addEventListener('DOMContentLoaded', () => {
	initSettingsUI();

	const addPlayerButton = document.getElementById('addPlayer');
	if (addPlayerButton) {
		addPlayerButton.addEventListener('click', addPlayer);
	} else {
		console.error('Add player button not found');
	}

	const game = new PongGame(settings);
	window.game = game;
	game.init();
});

const settings = {
	pointsToWin: 5,
	numberOfGames: 1
};

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

function updateValue(setting, change) {
	const display = document.getElementById(`${setting}Display`);
	if (!display) {
		console.error(`Display element for ${setting} not found`);
		return;
	}

	let value = parseInt(display.textContent) + change;
	value = Math.max(1, value);
	display.textContent = value;
	settings[setting] = value;
	
	if (window.game && window.game.tournamentSettings) {
		window.game.tournamentSettings[setting] = value;
	}
}

function addPlayer() {
	const playerInputs = document.getElementById('playerInputs');
	if (!playerInputs) {
		console.error('Player inputs container not found');
		return;
	}
	const playerCount = playerInputs.children.length + 1;
	const newPlayerDiv = document.createElement('div');
	newPlayerDiv.innerHTML = `<input type="text" id="player${playerCount}" placeholder="Player ${playerCount}">`;
	playerInputs.appendChild(newPlayerDiv);
}

