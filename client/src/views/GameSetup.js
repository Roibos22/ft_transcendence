import { GameModes } from '../constants.js';
import Router from '../router.js';
import state from '../State.js';
import * as Cookies from '../services/cookies.js';
import { buttonIdToGameMode } from '../utils/utils.js';

export class GameSetupView {
	constructor() {
		this.UIelements = null;
	}

	async init() {
		const content = await Router.loadTemplate('game-setup');
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
			displayNameInputs: {
				player1: document.getElementById('player1input'),
				player2: document.getElementById('player2input'),
				player2container: document.getElementById('player2container')
			},
			settingsButtons: {
				settingsContainer: document.getElementById('settingsView'),
				pointsToWinButtons: document.querySelectorAll('[data-setting="pointsToWin"]'),
				numberOfGamesButtons: document.querySelectorAll('[data-setting="numberOfGames"]')
			},
			startGameButtons: {
				start: document.getElementById('startGameButton'),
				oneVone: document.getElementById('online1v1Button'),
				tournament: document.getElementById('joinTournamentButton')
			}
				
		};
	}

	addEventListeners() {
		const gameModeButtons = this.UIelements.gameModeButtons;
		const { start } = this.UIelements.startGameButtons;
		const { pointsToWinButtons, numberOfGamesButtons } = this.UIelements.settingsButtons;

		Object.values(gameModeButtons).forEach(button => {
			button.addEventListener('click', (e) => {
				const id = e.target.id;
				state.set('gameSettings', 'mode', buttonIdToGameMode(id));
			});
		});

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

		start.addEventListener('click', () => {
			console.log('state', state.data);
			this.updatePlayers();
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
		const player1Input = this.UIelements.displayNameInputs.player1;
		const player2container = this.UIelements.displayNameInputs.player2container;
		const { start, oneVone, tournament } = this.UIelements.startGameButtons;
		const { pointsToWinButtons, numberOfGamesButtons, settingsContainer } = this.UIelements.settingsButtons;

		gameModeButtons.multiPlayer.classList.toggle('active', gameMode === GameModes.MULTI);
		gameModeButtons.singlePlayer.classList.toggle('active', gameMode === GameModes.SINGLE);
		gameModeButtons.online.classList.toggle('active', gameMode === GameModes.ONLINE);

		//set player1 placeholder
		player1Input.placeholder = gameMode === GameModes.ONLINE ? state.get('user', 'username') : 'Player 1';
		player2container.classList.toggle('d-none', gameMode !== GameModes.MULTI);

		settingsContainer.style.display = gameMode === GameModes.ONLINE ? 'none' : 'inline';
	
		start.classList.toggle('d-none', gameMode === GameModes.ONLINE);
		oneVone.classList.toggle('d-none', gameMode !== GameModes.ONLINE);
		tournament.classList.toggle('d-none', gameMode !== GameModes.ONLINE);
	
		Object.values(pointsToWinButtons).forEach(button => {
			const value = parseInt(button.dataset.value);
			button.classList.toggle('active', pointsToWin === value);
		});
		Object.values(numberOfGamesButtons).forEach(button => {
			const value = parseInt(button.dataset.value);
			button.classList.toggle('active', numberOfGames === value);
		});
	}

	updatePlayers() {
		const { player1, player2 } = this.UIelements.displayNameInputs;

		player1.value = player1.value || player1.placeholder;
		player2.value = player2.value || player2.placeholder;

		state.set('currentMatch', 'player1Name', player1.value);
		if (state.get('gameSettings', 'mode') === GameModes.MULTI) {
			state.set('currentMatch', 'player2Name', player2.value);
		}
		state.set('user', 'displayName', player1.value);
	}
}
