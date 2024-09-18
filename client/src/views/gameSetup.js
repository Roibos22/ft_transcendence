import { GameModes } from '../constants.js';
import { loadTemplate } from '../router.js';
import state from '../State.js';
import * as Cookies from '../services/cookies.js';
import * as PlayerUtils from '../utils/playerUtils.js';
import { buttonIdToGameMode } from '../utils/utils.js';

export class GameSetupView {
	constructor() {
		this.UIelements = null;
	}

	async init() {
		const content = await loadTemplate('game-setup');
		document.getElementById('app').innerHTML = content;

		this.UIelements = this.getUIElements();
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
			multiPlayerOptions:{
				playerInputsContainer: document.getElementById('playerInputs'),
				addPlayerButton: document.getElementById('addPlayer')
			},
			settingsButtons: {
				settingsContainer: document.getElementById('settingsView'),
				pointsToWinButtons: document.querySelectorAll('[data-setting="pointsToWin"]'),
				numberOfGamesButtons: document.querySelectorAll('[data-setting="numberOfGames"]')
			},
			playerInput: document.getElementById('playerForm'),
			startGameButton: document.getElementById('startGameButton')
		};
	}

	addEventListeners() {
		const gameModeButtons = this.UIelements.gameModeButtons;
		const { playerInput, startGameButton } = this.UIelements;
		const { addPlayerButton, playerInputsContainer } = this.UIelements.multiPlayerOptions;
		const { pointsToWinButtons, numberOfGamesButtons } = this.UIelements.settingsButtons;

		Object.values(gameModeButtons).forEach(button => {
			button.addEventListener('click', (e) => {
				const id = e.target.id;
				state.set('gameSettings', 'mode', buttonIdToGameMode(id));
			});
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

		Object.values(pointsToWinButtons).forEach(button => {
			button.addEventListener('click', (e) => {
				const value = parseInt(e.target.dataset.value);
				state.set('gameSettings', 'pointsToWin', value);
			});
		});

		Object.values(numberOfGamesButtons).forEach(button => {
			button.addEventListener('click', (e) => {
				const value = parseInt(e.target.dataset.value);
				state.set('gameSettings', 'numberOfGames', value);
			});
		});

		startGameButton.addEventListener('click', () => {
			PlayerUtils.updatePlayers();
		});
	}

	initSettingsUI() {
		const username = Cookies.getCookie("username");
		const player1Input = document.getElementById('player1');
		if (player1Input && username) {
			player1Input.value = username;
		}
	}

	update() {
		const gameMode = state.get('gameSettings', 'mode');
		const pointsToWin = state.get('gameSettings', 'pointsToWin');
		const numberOfGames = state.get('gameSettings', 'numberOfGames');

		const gameModeButtons = this.UIelements.gameModeButtons;
		const { addPlayerButton, playerInputsContainer } = this.UIelements.multiPlayerOptions;
		const { startGameButton } = this.UIelements;
		const { pointsToWinButtons, numberOfGamesButtons, settingsContainer } = this.UIelements.settingsButtons;

		gameModeButtons.multiPlayer.classList.toggle('active', gameMode === GameModes.MULTI);
		gameModeButtons.singlePlayer.classList.toggle('active', gameMode === GameModes.SINGLE);
		gameModeButtons.online.classList.toggle('active', gameMode === GameModes.ONLINE);

		addPlayerButton.style.display = gameMode === GameModes.MULTI ? 'block' : 'none';
		startGameButton.href = gameMode === GameModes.ONLINE ? '/online-game' : '/game';
		settingsContainer.style.display = gameMode === GameModes.ONLINE ? 'none' : 'block';
		playerInputsContainer.style.display =  gameMode === GameModes.MULTI ? 'block' : 'none';
	
		Object.values(pointsToWinButtons).forEach(button => {
			const value = parseInt(button.dataset.value);
			button.classList.toggle('active', pointsToWin === value);
		});
		Object.values(numberOfGamesButtons).forEach(button => {
			const value = parseInt(button.dataset.value);
			button.classList.toggle('active', numberOfGames === value);
		});
	}
}
