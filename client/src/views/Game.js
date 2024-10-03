import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import { GameModes } from '../constants.js';
import * as gameService from '../services/api/gameService.js';
import Router from '../router.js';
import State from '../State.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIManager = null;
		this.gameSocket = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;

		if (State.get('gameSettings', 'mode') === GameModes.SINGLE) {
			await this.getSinglePlayerGame();
		}

		this.game = new PongGame(this.gameSocket);
		this.UIManager = new UIManager();
	}

	update() {
		this.game.update();
		this.UIManager.update();
	}

	async getSinglePlayerGame() {
		throw new Error('Not implemented');
		const response = await gameService.createSinglePlayerGame();
		const data = await response.json();
		if (!data.gameId) {
			throw new Error();
		}
		this.gameSocket = new Socket('local_game', { gameId: data.gameId });
	}
}
