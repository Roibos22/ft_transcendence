import { createRouter } from './router.js';
import { PongGame, GameModes, settings } from './index.js';

const { initRouter: initRouterFunction } = createRouter(initGame);

document.addEventListener('DOMContentLoaded', function() {
	initRouterFunction();

	const loginForm = document.getElementById('loginForm');
	const showRegistrationLink = document.getElementById('showRegistration');
	const showLoginLink = document.getElementById('showLogin');
	const registrationForm = document.getElementById('registrationForm');
	const startGameButton = document.getElementById('startGame');
	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const multiPlayerBtn = document.getElementById('btn_multiplayer');

	singlePlayerBtn.addEventListener('change', updateUIForGameMode);
	multiPlayerBtn.addEventListener('change', updateUIForGameMode);

	// loginForm.addEventListener('submit', function(e) {
	// 	e.preventDefault();
	// 	const username = document.getElementById('username').value;
	// 	//const password = document.getElementById('password').value;
	// 	loginView.style.display = 'none';
	// 	gameSetupView.style.display = 'block';
	// 	initGame(username)
	// });

	document.querySelectorAll('.decrease-points, .increase-points, .decrease-games, .increase-games').forEach(button => {
		button.addEventListener('click', function() {
			const setting = this.dataset.setting;
			const change = this.classList.contains('increase-points') || this.classList.contains('increase-games') ? 1 : -1;
			updateValue(setting, change);
		});
	});

	loginForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const username = document.getElementById('username').value;
		localStorage.setItem('username', username);
		window.location.hash = '#/setup';

		const response = fetch('http://localhost:8000/users/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': 'Bearer <token>' // Uncomment and replace <token> if needed
			},
			//body: JSON.stringify(userData)
		});

		console.log(response);

	});

	showRegistrationLink.addEventListener('click', function(e) {
		e.preventDefault();
		// loginView.style.display = 'none';
		// registrationView.style.display = 'block';
		window.location.hash = '#/register';
	});

	showLoginLink.addEventListener('click', function(e) {
		e.preventDefault();
		// registrationView.style.display = 'none';
		// loginView.style.display = 'block';
		window.location.hash = '#/';
	});

	registrationForm.addEventListener('submit', function(e) {
		e.preventDefault();
		registerUser();
	});

	startGameButton.addEventListener('click', function() {
		window.location.hash = '#/game';
	});

	// document.getElementById('registrationForm').addEventListener('submit', function(e) {
	// 	e.preventDefault();
	// 	registerUser();
	// });

	// // Add event listener for showLogin link
	// document.getElementById('showLogin').addEventListener('click', function(e) {
	// 	e.preventDefault();
	// 	showLoginView();
	// });

	updateUIForGameMode();
});


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
			body: JSON.stringify(userData)
		});

		// With no-cors, we can't check response.ok or parse JSON
		console.log('Request sent:', response);
		alert('Registration request sent. Please try logging in.');
		showLoginView();
	} catch (error) {
		console.error('Error during registration:', error);
		alert('An error occurred during registration. Please try again later.');
	}
	window.location.hash = '#/';

	try {
		const response = await fetch('http://localhost:8000/users/create/', {
			method: 'POST',
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
			showLoginView();
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
	const singlePlayerBtn = document.getElementById('btn_singleplayer');
	const addPlayerButton = document.getElementById('addPlayer');
	const playerInputs = document.getElementById('playerInputs');

	if (singlePlayerBtn.checked) {
		deleteAllPlayersButOne();
		addPlayerButton.style.display = 'none';
		settings.mode = GameModes.SINGLE;
	} else {
		if (playerInputs.children.length === 1) {
			addPlayer(); // Add a second player for multiplayer mode
		}
		addPlayerButton.style.display = 'block';
		settings.mode = GameModes.MULTI;
	}
}
