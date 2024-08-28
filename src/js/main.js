document.addEventListener('DOMContentLoaded', function() {
	const loginView = document.getElementById('loginView');
	const gameSetupView = document.getElementById('gameSetupView');
	const loginForm = document.getElementById('loginForm');

	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const multiPlayerBtn = document.getElementById('btn_multiplayer');

	singlePlayerBtn.addEventListener('change', updateUIForGameMode);
	multiPlayerBtn.addEventListener('change', updateUIForGameMode);

	loginForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const username = document.getElementById('username').value;
		//const password = document.getElementById('password').value;
		loginView.style.display = 'none';
		gameSetupView.style.display = 'block';
		initGame(username)
	});

	updateUIForGameMode();
});

function updateUIForGameMode() {
	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const multiPlayerBtn = document.getElementById('btn_multiplayer');
	const addPlayerButton = document.getElementById('addPlayer');

	if (singlePlayerBtn.checked) {
		deleteAllPlayersButOne();
		addPlayerButton.style.display = 'none';
		settings.mode = GameModes.SINGLE;
	} else if (multiPlayerBtn.checked) {
		addPlayer()
		addPlayerButton.style.display = 'block';
		settings.mode = GameModes.MULTI;
	}
}

function initGame(username) {
	initSettingsUI();

	const addPlayerButton = document.getElementById('addPlayer');
	addPlayerButton.addEventListener('click', addPlayer);

	setFirstPlayerName(username);

	const game = new PongGame(settings);
	window.game = game;
	game.init();
}

function setFirstPlayerName(username) {
	const playerInputs = document.getElementById('playerInputs');
	const firstPlayerInput = playerInputs.querySelector('input');
	if (username) {
		firstPlayerInput.value = username;
	}
}

const GameModes = {
	SINGLE: 'single',
	MULTI: 'multi',
};

const settings = {
	pointsToWin: 5,
	numberOfGames: 1,
	username: "",
	mode: GameModes.SINGLE
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
	newPlayerDiv.innerHTML = `<div class="mb-3"> <input type="text" class="form-control" id="player${playerCount}" placeholder="Player ${playerCount}"> </div>`;
	playerInputs.appendChild(newPlayerDiv);
}

function deleteAllPlayersButOne() {
	const playerInputs = document.getElementById('playerInputs');
	const inputDivs = Array.from(playerInputs.children);
	for (let i = inputDivs.length - 1; i > 0; i--) {
		playerInputs.removeChild(inputDivs[i]);
	}
}