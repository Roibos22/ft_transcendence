// Global constants and settings
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

let players = [];

// Main initialization function
function initMain() {
    document.addEventListener('DOMContentLoaded', function() {
        initCurrentView();
    });
}

function initCurrentView() {
    console.log("init current View called");
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/login') {
        initLoginView();
    } else if (currentPath === '/register') {
        initRegisterView();
    } else if (currentPath === '/game-setup') {
        initGameSetupView();
    } else if (currentPath === '/game') {
        initGameView();
    }
}

function initLoginView() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            window.history.pushState({}, "", "/game-setup");
            if (typeof urlLocationHandler === 'function') {
                urlLocationHandler();
            } else {
                initCurrentView();
            }
        });
    }

    const showRegistrationLink = document.getElementById('showRegistration');
    if (showRegistrationLink) {
        showRegistrationLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.pushState({}, "", "/register");
            if (typeof urlLocationHandler === 'function') {
                urlLocationHandler();
            } else {
                initCurrentView();
            }
        });
    }
}

function initRegisterView() {
    const showLoginLink = document.getElementById('showLogin');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.pushState({}, "", "/");
            if (typeof urlLocationHandler === 'function') {
                urlLocationHandler();
            } else {
                initCurrentView();
            }
        });
    }
}

function initGameSetupView() {
    console.log("Initializing Game Setup View");
    const singlePlayerBtn = document.getElementById('btn_singleplayer');
    const multiPlayerBtn = document.getElementById('btn_multiplayer');
    const addPlayerButton = document.getElementById('addPlayer');

    if (singlePlayerBtn && multiPlayerBtn) {
        singlePlayerBtn.addEventListener('change', updateUIForGameMode);
        multiPlayerBtn.addEventListener('change', updateUIForGameMode);
    }

    if (addPlayerButton) {
        addPlayerButton.addEventListener('click', addPlayer);
    }
    updateUIForGameMode();
    initSettingsUI();
    updatePlayers();
}

function initGameView() {
    console.log("Initializing Game View");
    //const players = collectPlayerData();
    const game = new PongGame(settings, players);
    //game.collectPlayerData();
	game.tournament = new Tournament(game, players, settings);
    //initGame();
	game.startGame();
    // const singlePlayerBtn = document.getElementById('btn_singleplayer');
    // const multiPlayerBtn = document.getElementById('btn_multiplayer');
    // const addPlayerButton = document.getElementById('addPlayer');

    // if (singlePlayerBtn && multiPlayerBtn) {
    //     singlePlayerBtn.addEventListener('change', updateUIForGameMode);
    //     multiPlayerBtn.addEventListener('change', updateUIForGameMode);
    // }

    // if (addPlayerButton) {
    //     addPlayerButton.addEventListener('click', addPlayer);
    // }
    // updateUIForGameMode();
    // initSettingsUI();
}

function updatePlayers() {
    players = [];
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
    console.log("Updated players:", players);
}


// function collectPlayerData() {
//     const playerInputs = document.querySelectorAll('#playerInputs input');
//     playerInputs.forEach((input, index) => {
//         const playerName = input.value.trim() || `Player ${index + 1}`;
//         this.players.push({
//             name: playerName,
//             score: 0
//         });
//     });
//     if (this.tournamentSettings.mode === GameModes.SINGLE) {
//         this.players.push({
//             name: "AI Player",
//             score: 0
//         });
//     }
// }

function initGame() {
    initSettingsUI();
    //setFirstPlayerName(username);

    const game = new PongGame(settings);
    window.game = game;
    //game.init();
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
}



function setFirstPlayerName(username) {
    const playerInputs = document.getElementById('playerInputs');
    if (playerInputs) {
        const firstPlayerInput = playerInputs.querySelector('input');
        if (firstPlayerInput && username) {
            firstPlayerInput.value = username;
        }
    }
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
    console.log("addPlayer function called");
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
    updatePlayers();
}

function deleteAllPlayersButOne() {
    const playerInputs = document.getElementById('playerInputs');
    if (playerInputs) {
        while (playerInputs.children.length > 1) {
            playerInputs.removeChild(playerInputs.lastChild);
        }
    }
}

function deletePlayer(button) {
    const playerInputGroup = button.closest('.player-input-group');
    if (playerInputGroup) {
        playerInputGroup.remove();
        renumberPlayers();
        updatePlayers();
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

// Call the main initialization function
initMain();

// If urlLocationHandler is not defined elsewhere, you can uncomment this:
/*
if (typeof urlLocationHandler === 'undefined') {
    window.urlLocationHandler = initCurrentView;
}
*/