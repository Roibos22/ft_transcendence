document.addEventListener('DOMContentLoaded', function() {
	const loginView = document.getElementById('loginView');
	const registrationView = document.getElementById('registrationView');
	const showRegistrationLink = document.getElementById('showRegistration');
	const showLoginLink = document.getElementById('showLogin');
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

	showRegistrationLink.addEventListener('click', function(e) {
		e.preventDefault();
		loginView.style.display = 'none';
		registrationView.style.display = 'block';
	});

	showLoginLink.addEventListener('click', function(e) {
		e.preventDefault();
		registrationView.style.display = 'none';
		loginView.style.display = 'block';
	});

	document.getElementById('registrationForm').addEventListener('submit', function(e) {
		e.preventDefault();
		registerUser();
	});

	// Add event listener for showLogin link
	document.getElementById('showLogin').addEventListener('click', function(e) {
		e.preventDefault();
		showLoginView();
	});

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
}

function showLoginView() {
	document.getElementById('registrationView').style.display = 'none';
	document.getElementById('loginView').style.display = 'block';
}

function showRegistrationView() {
	document.getElementById('loginView').style.display = 'none';
	document.getElementById('registrationView').style.display = 'block';
}

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
