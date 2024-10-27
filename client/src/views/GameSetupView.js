import { GameModes } from '../constants.js';
import Router from '../Router.js';
import State from '../State.js';
import * as Cookies from '../services/cookies.js';
import { buttonIdToGameMode } from '../utils/utils.js';
import * as Notification from '../services/notification.js';

export class GameSetupView {
	constructor() {
		this.UIelements = null;
		this.players = [];
	}

	async init() {
		const content = await Router.loadTemplate('game-setup');
		document.getElementById('app').innerHTML = content;
		this.UIelements = this.getUIElements();
		this.UIelements.player1Input.value = Cookies.getCookie("username");
		State.reset();
		this.addEventListeners();
		this.update();
	}

	getUIElements() {
		return {
			gameModeButtons: {
				singlePlayer: document.getElementById('btn_singleplayer'),
				multiPlayer: document.getElementById('btn_multiplayer'),
				online: document.getElementById('btn_online')
			},
			displayNameInputs: {
				player1: document.getElementById('player1input'),
				player2: document.getElementById('player2input'),
				player2container: document.getElementById('player2container')
			},
			settingsButtons: {
				settingsContainer: document.getElementById('settingsView'),
				numberOfGamesButtons: document.querySelectorAll('[data-setting="numberOfGames"]')
			},
			startGameButtons: {
				start: document.getElementById('startGameButton'),
				oneVone: document.getElementById('online1v1Button'),
				tournament: document.getElementById('joinTournamentButton')
			},
			playerInputs: document.getElementById('playerInput'),
			player1Input: document.getElementById('player1input'),
			addPlayerButton: document.getElementById('addPlayerButton'),
			profileButton: document.getElementById('btn_profile'),
			logoutButton: document.getElementById('btn_logout')
		};
	}

	addEventListeners() {
		const gameModeButtons = this.UIelements.gameModeButtons;
		const { start } = this.UIelements.startGameButtons;
		const { numberOfGamesButtons } = this.UIelements.settingsButtons;

		Cookies.setCookie("gameMode", GameModes.SINGLE, 24);

		this.UIelements.profileButton.addEventListener('click', (e) => {
			e.preventDefault();
			window.history.pushState({}, "", "/profile");
			Router.handleLocationChange();
		});

		this.UIelements.logoutButton.addEventListener('click', (e) => {
			e.preventDefault();
			State.reset();

			//TODO
			Cookies.deleteCookie("accessToken");
			Cookies.deleteCookie("refreshToken");
			Cookies.deleteCookie("gameId");
			Cookies.deleteCookie("username");
			Cookies.deleteCookie("gameMode");

			window.history.pushState({}, "", "/");
			Router.handleLocationChange();
		});


		Object.values(gameModeButtons).forEach(button => {
			button.addEventListener('click', (e) => {
				const id = e.target.id;
				const gameMode = buttonIdToGameMode(id);
				Cookies.setCookie("gameMode", gameMode, 24);
				State.set('gameSettings', 'mode', gameMode);
				this.deleteAllPlayersButOne();
				if (gameMode === GameModes.MULTI) {
					this.addSecondPlayer();
				}
			});
		});

		Object.values(numberOfGamesButtons).forEach(button => {
			button.addEventListener('click', (e) => {
				const value = parseInt(e.target.dataset.value);
				State.set('tournament', 'numberOfGames', value);
			});
		});

		this.UIelements.addPlayerButton.addEventListener('click', () => {
			this.addPlayerInput();
		});

		start.addEventListener('click', () => {
			this.updatePlayers();
		});

		this.UIelements.playerInputs.addEventListener('click', (e) => {
			if (e.target.classList.contains('delete-player-btn')) {
				this.deletePlayer(e.target);
			}
		});

		this.UIelements.player1Input.addEventListener('input', () => {
			const input = this.UIelements.player1Input;
			const name = input.value;
			const newName = name.replace(/[^a-zA-Z0-9 ]/g, '');

			if (newName !== name) {
				Notification.showErrorNotification('Player name can only contain letters and numbers');
			}

			input.value = newName;
		}
		);
	}

	initSettingsUI() {
		const username = Cookies.getCookie("username");
		const playerInput = document.getElementById('player1');
		if (playerInput && username) {
			playerInput.value = username;
		}
	}

	update() {
		const gameMode = State.get('gameSettings', 'mode');
		const numberOfGames = State.get('tournament', 'numberOfGames');

		const gameModeButtons = this.UIelements.gameModeButtons;
		const { start, oneVone, tournament } = this.UIelements.startGameButtons;
		const { numberOfGamesButtons, settingsContainer } = this.UIelements.settingsButtons;

		gameModeButtons.multiPlayer.classList.toggle('active', gameMode === GameModes.MULTI);
		gameModeButtons.singlePlayer.classList.toggle('active', gameMode === GameModes.SINGLE);
		gameModeButtons.online.classList.toggle('active', gameMode === GameModes.ONLINE);

		this.UIelements.addPlayerButton.classList.toggle('d-none', gameMode !== GameModes.MULTI);

		settingsContainer.style.display = gameMode === GameModes.ONLINE ? 'none' : 'inline';
	
		start.classList.toggle('d-none', gameMode === GameModes.ONLINE);
		oneVone.classList.toggle('d-none', gameMode !== GameModes.ONLINE);
	
		Object.values(numberOfGamesButtons).forEach(button => {
			const value = parseInt(button.dataset.value);
			button.classList.toggle('active', numberOfGames === value);
		});
	}

	updatePlayers() {
		this.players = [];
		const playerInputs = this.UIelements.playerInputs.querySelectorAll('input');
		playerInputs.forEach((input, index) => {
			const playerName = input.value.trim() || `Player ${index + 1}`;
			this.players.push({
				name: playerName
			});
		});
		if (State.get('gameSettings', 'mode') === GameModes.SINGLE && this.players.length === 1) {
			this.players.push({
				name: "AI Player"
			});
		}
		State.set('tournament', 'players', this.players);
	}

	addPlayerInput() {
		const playerCount = this.UIelements.playerInputs.children.length + 1;
		const newPlayerInput = document.createElement('div');
		newPlayerInput.className = 'player-input-group mb-3';
		newPlayerInput.innerHTML = `
			<div class="input-group">
				<input type="text" class="form-control player-name-input form-input" id="player${playerCount}" placeholder="Player ${playerCount}" autocomplete="off" pattern="^[a-zA-Z0-9 ]+$">
				<button class="btn btn-outline-secondary delete-player-btn" type="button">X</button>
			</div>
		`;

		newPlayerInput.querySelector('input').addEventListener('input', () => {
			const input = newPlayerInput.querySelector('input');
			const name = input.value;
			const newName = name.replace(/[^a-zA-Z0-9 ]/g, '');

			if (newName !== name) {
				Notification.showErrorNotification('Player name can only contain letters and numbers');
			}

			input.value = newName;
		});

		this.UIelements.playerInputs.appendChild(newPlayerInput);
		this.updatePlayers();
	}

	addSecondPlayer() {
		const newPlayerInput = document.createElement('div');
		newPlayerInput.className = 'player-input-group mb-3';
		newPlayerInput.innerHTML = `
			<div class="input-group">
				<input type="text" class="form-control player-name-input form-input" id="player2" placeholder="Player 2" autocomplete="off">
			</div>
		`;

		newPlayerInput.querySelector('input').addEventListener('input', () => {
			const input = newPlayerInput.querySelector('input');
			const name = input.value;
			const newName = name.replace(/[^a-zA-Z0-9 ]/g, '');

			if (newName !== name) {
				Notification.showErrorNotification('Player name can only contain letters and numbers');
			}

			input.value = newName;
		});

		this.UIelements.playerInputs.appendChild(newPlayerInput);
		this.updatePlayers();
	}

	deletePlayer(button) {
		const playerInputGroup = button.closest('.player-input-group');
		if (playerInputGroup) {
			if (this.UIelements.playerInputs.children.length > 1) {
				playerInputGroup.remove();
				this.renumberPlayersInput();
				this.updatePlayers();
			}
		} else {
			console.error('Could not find parent .player-input-group');
		}
	}

	deleteAllPlayersButOne() {
		while (this.UIelements.playerInputs.children.length > 1) {
			this.UIelements.playerInputs.removeChild(this.UIelements.playerInputs.lastChild);
		}
		this.updatePlayers();
	}

	renumberPlayersInput() {
		const inputGroups = this.UIelements.playerInputs.querySelectorAll('.player-input-group');
		console.log(inputGroups);
		inputGroups.forEach((group, index) => {
			const input = group.querySelector('input');
			if (input) {
				input.id = `player${index + 1}`;
				input.placeholder = `Player ${index + 1}`;
			}
		});
	}

}
