import { createRouter } from './router.js';
import { PongGame, GameModes, settings } from './index.js';

let router;
let game;

function initGame(username) {
	console.log('Initializing game for user:', username);
	initSettingsUI();
	setFirstPlayerName(username);

	// Create the game instance but don't initialize it yet
	game = new PongGame(settings);
	window.game = game;

	const addPlayerButton = document.getElementById('addPlayer');
	if (addPlayerButton) {
		addPlayerButton.addEventListener('click', addPlayer);
	}
}

function onViewLoaded() {
	console.log('onViewLoaded called');
	setupEventListeners();
	updateUIForGameMode();

	// Check if we're on the game view
	if (window.location.hash === '#/game') {
		console.log('On game view, initializing PongGame');
		if (game) {
			game.init().then(() => {
				console.log('PongGame initialized successfully');
			}).catch(error => {
				console.error('Failed to initialize PongGame:', error);
			});
		} else {
			console.error('Game instance not created');
		}
	}
}
function setupEventListeners() {
	console.log('Setting up event listeners');
	const loginForm = document.getElementById('loginForm');
	const showRegistrationLink = document.getElementById('showRegistration');
	const showLoginLink = document.getElementById('showLogin');
	const registrationForm = document.getElementById('registrationForm');
	const startGameButton = document.getElementById('startGame');
	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const multiPlayerBtn = document.getElementById('btn_multiplayer');

	if (singlePlayerBtn && multiPlayerBtn) {
		singlePlayerBtn.addEventListener('change', updateUIForGameMode);
		multiPlayerBtn.addEventListener('change', updateUIForGameMode);
		// Only call updateUIForGameMode if we're on the game setup view
		updateUIForGameMode();
	}

	document.querySelectorAll('.decrease-points, .increase-points, .decrease-games, .increase-games').forEach(button => {
		button.addEventListener('click', function() {
			const setting = this.dataset.setting;
			const change = this.classList.contains('increase-points') || this.classList.contains('increase-games') ? 1 : -1;
			updateValue(setting, change);
		});
	});

	if (startGameButton) {
		startGameButton.addEventListener('click', function() {
			console.log('Start Game button clicked');
			window.location.hash = '#/game';
		});
	}

	if (loginForm) {
		loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const username = document.getElementById('username').value;
			localStorage.setItem('username', username);
			console.log('Login form submitted, navigating to setup');
			window.location.hash = '#/setup';
		});
	}

	if (showRegistrationLink) {
		showRegistrationLink.addEventListener('click', function(e) {
			e.preventDefault();
			console.log('Navigating to registration');
			window.location.hash = '#/register';
		});
	}

	if (showLoginLink) {
		showLoginLink.addEventListener('click', function(e) {
			e.preventDefault();
			console.log('Navigating to login');
			window.location.hash = '#/';
		});
	}

	if (registrationForm) {
		registrationForm.addEventListener('submit', function(e) {
			e.preventDefault();
			registerUser();
		});
	}

	if (startGameButton) {
		startGameButton.addEventListener('click', function() {
			console.log('Navigating to game');
			window.location.hash = '#/game';
		});
	}

	updateUIForGameMode();
}

async function registerUser() {
	const firstName = document.getElementById('first_name_registration').value;
	const lastName = document.getElementById('last_name_registration').value;
	const username = document.getElementById('username_registration').value;
	const email = document.getElementById('email_registration').value;
	const password = document.getElementById('password_registration').value;

	const userData = {
		username: username,
		email: email,
		password: password,
		first_name: firstName,
		last_name: lastName,
		// You can add other optional fields here if needed
		// avatar: "",
		// active: true
	};

	try {
		const response = await fetch('http://localhost:8000/users/create/', {
			method: 'POST',
			//mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': 'Bearer <token>' // Uncomment and replace <token> if needed
			},
			body: JSON.stringify(userData)
		});

		if (response.ok) {
			const data = await response.json();
			console.log('User registered successfully:', data);
			alert('Registration successful! Please log in.');
			//showLoginView();
		} else {
			const errorData = await response.json();
			console.error('Registration failed:', errorData);
			alert('Registration failed. Please try again.');
		}
	} catch (error) {
		console.error('Error during registration:', error);
		alert('An error occurred during registration. Please try again later.');
	}
	window.location.hash = '#/';
}

function showLoginView() {
	document.getElementById('registrationView').style.display = 'none';
	document.getElementById('loginView').style.display = 'block';
}

function showRegistrationView() {
	document.getElementById('loginView').style.display = 'none';
	document.getElementById('registrationView').style.display = 'block';
}

// function updateUIForGameMode() {
// 	const singlePlayerBtn = document.getElementById('btn_singleplayer');
// 	const multiPlayerBtn = document.getElementById('btn_multiplayer');
// 	const addPlayerButton = document.getElementById('addPlayer');

// 	if (singlePlayerBtn.checked) {
// 		deleteAllPlayersButOne();
// 		addPlayerButton.style.display = 'none';
// 		settings.mode = GameModes.SINGLE;
// 	} else if (multiPlayerBtn.checked) {
// 		addPlayer()
// 		addPlayerButton.style.display = 'block';
// 		settings.mode = GameModes.MULTI;
// 	}
// }




function setFirstPlayerName(username) {
	const playerInputs = document.getElementById('playerInputs');
	const firstPlayerInput = playerInputs.querySelector('input');
	if (username) {
		firstPlayerInput.value = username;
	}
}

// const GameModes = {
// 	SINGLE: 'single',
// 	MULTI: 'multi',
// };

// const settings = {
// 	pointsToWin: 5,
// 	numberOfGames: 1,
// 	username: "",
// 	mode: GameModes.SINGLE
// };

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
	newPlayerDiv.className = 'player-input-group mb-3';
	newPlayerDiv.innerHTML = `
		<div class="input-group">
			<input type="text" class="form-control" id="player${playerCount}" placeholder="Player ${playerCount}">
			<button type="button" class="btn btn-danger" onclick="deletePlayer(this)">X</button>
		</div>
	`;
	playerInputs.appendChild(newPlayerDiv);
}

function deleteAllPlayersButOne() {
	const playerInputs = document.getElementById('playerInputs');
	while (playerInputs.children.length > 1) {
		playerInputs.removeChild(playerInputs.lastChild);
	}
}

function deletePlayer(button) {
	const playerInputGroup = button.closest('.player-input-group');
	if (playerInputGroup) {
		playerInputGroup.remove();
		renumberPlayers();
	} else {
		console.error('Could not find parent .player-input-group');
	}
}

function renumberPlayers() {
	const playerInputs = document.getElementById('playerInputs');
	const inputGroups = playerInputs.querySelectorAll('.player-input-group');
	inputGroups.forEach((group, index) => {
		const input = group.querySelector('input');
		input.id = `player${index + 1}`;
		input.placeholder = `Player ${index + 1}`;
	});
}

function updateUIForGameMode() {
	console.log('Updating UI for game mode');
	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const addPlayerButton = document.getElementById('addPlayer');
	const playerInputs = document.getElementById('playerInputs');

	// Check if we're on a view that has these elements
	if (!singlePlayerBtn || !addPlayerButton || !playerInputs) {
		console.log('Not on game setup view, skipping UI update');
		return;
	}

	if (singlePlayerBtn.checked) {
		console.log('Single player mode selected');
		deleteAllPlayersButOne();
		addPlayerButton.style.display = 'none';
		settings.mode = GameModes.SINGLE;
	} else {
		console.log('Multiplayer mode selected');
		if (playerInputs.children.length === 1) {
			addPlayer(); // Add a second player for multiplayer mode
		}
		addPlayerButton.style.display = 'block';
		settings.mode = GameModes.MULTI;
	}
}

function onDOMContentLoaded() {
    console.log('DOM fully loaded and parsed');
    router = createRouter(initGame);
    router.initRouter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    onDOMContentLoaded();
}


// Expose necessary functions to the global scope
window.onViewLoaded = onViewLoaded;
window.initGame = initGame;
window.deletePlayer = deletePlayer;  // Make sure this function is defined

console.log('main.js executed');

