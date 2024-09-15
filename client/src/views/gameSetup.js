import { GameModes } from '../constants.js';
import { loadTemplate } from '../router.js';
import state from '../State.js';
import * as Cookies from '../services/cookies.js';
import * as PlayerUtils from '../utils/playerUtils.js';

export class GameSetupView {
	constructor() {
		this.UIelements = null;
	}

	async init() {
		const content = await loadTemplate('game-setup');
		document.getElementById('app').innerHTML = content;

		this.UIelements = this.getUIElements();
		this.addEventListeners();
		this.initSettingsUI();
		this.updateUIForGameMode();
	}

	getUIElements() {
		return {
			gameModeButtons: {
				singlePlayer: document.getElementById('btn_singleplayer'),
				multiPlayer: document.getElementById('btn_multiplayer'),
				online: document.getElementById('btn_online')
			},
			multiPlayerOptions:{
				addPlayerButton: document.getElementById('addPlayer'),
				playerInputsContainer: document.getElementById('playerInputs')
			},
			settingsButtons: document.querySelectorAll('[data-setting]'),
			playerInput: document.getElementById('playerForm'),
			startGameButton: document.getElementById('startGameButton')
		};
	}

	addEventListeners() {
		const gameModeButtons = this.UIelements.gameModeButtons;
		const { settingsButtons, playerInput } = this.UIelements;
		const { addPlayerButton, playerInputsContainer } = this.UIelements.multiPlayerOptions;

		Object.values(gameModeButtons).forEach(button => {
			if (button) button.addEventListener('click', () => this.updateUIForGameMode(button));
		});

		if (addPlayerButton) {
			addPlayerButton.addEventListener('click', PlayerUtils.addPlayer);
		}

		if (playerInputsContainer) {
			playerInputsContainer.addEventListener('click', (e) => {
				if (e.target.classList.contains('btn-danger')) {
					PlayerUtils.deletePlayer(e.target);
				}
			});
		}

		settingsButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				const setting = button.dataset.setting;
				const value = parseInt(button.dataset.value);
				this.updateValue(setting, value);
			});
		});

		playerInput.addEventListener('input', function() {
			PlayerUtils.updatePlayers();
		});
	}

	initSettingsUI() {
		const settingsToUpdate = ['pointsToWin', 'numberOfGames'];
		
		settingsToUpdate.forEach(setting => {
			const buttons = document.querySelectorAll(`[data-setting="${setting}"]`);
			buttons.forEach(button => {
				const value = parseInt(button.dataset.value);
				if (state.get(`gameSettings.${setting}`) === value) {
					button.classList.add('active');
				} else {
					button.classList.remove('active');
				}
			});
		});
	
		const username = Cookies.getCookie("username");
		const player1Input = document.getElementById('player1');
		if (player1Input && username) {
			player1Input.value = username;
		}
	}

	updateUIForGameMode(button) {
		const selectedButton = button ? button : document.querySelector('.btn-game-mode.active') || this.UIelements.gameModeButtons.singlePlayer;
		if (!selectedButton) return;

		const gameModeButtons = this.UIelements.gameModeButtons;
		const { addPlayerButton, playerInputs } = this.UIelements.multiPlayerOptions;
		const { startGameButton, settingsView } = this.UIelements;
	
		
		Object.values(gameModeButtons).forEach(button => {
			if (button) button.classList.remove('active');
		});
		selectedButton.classList.add('active');
		PlayerUtils.deleteAllPlayersButOne();
	
		if (selectedButton === gameModeButtons.singlePlayer) {
			if (addPlayerButton) addPlayerButton.style.display = 'none';
			state.set('gameSettings.mode', GameModes.SINGLE);
			if (startGameButton) startGameButton.href = '/game';
			if (playerInputs) playerInputs.style.display = 'block';
			if (settingsView) settingsView.style.display = 'block';
		} else if (selectedButton === gameModeButtons.multiPlayer) {
			PlayerUtils.addPlayer();
			if (addPlayerButton) addPlayerButton.style.display = 'block';
			state.set('gameSettings.mode', GameModes.MULTI);
			if (startGameButton) startGameButton.href = '/game';
			if (playerInputs) playerInputs.style.display = 'block';
			if (settingsView) settingsView.style.display = 'block';
		} else if (selectedButton === gameModeButtons.online) {
			state.set('gameSettings.mode', GameModes.ONLINE);
			if (addPlayerButton) addPlayerButton.style.display = 'none';
			if (startGameButton) startGameButton.href = '/online-game';
			if (playerInputs) playerInputs.style.display = 'block';
			if (settingsView) settingsView.style.display = 'none';
		}
	
		PlayerUtils.updatePlayers();
	}

	updateValue(setting, newValue) {
		if (state.get('gameSettings')[setting] !== newValue) {
			state.set(`gameSettings.${setting}`, newValue);
			
			const buttons = document.querySelectorAll(`[data-setting="${setting}"]`);
			buttons.forEach(button => {
				const value = parseInt(button.dataset.value);
				if (value === newValue) {
					button.classList.add('active');
				} else {
					button.classList.remove('active');
				}
			});
		}
	}
}
