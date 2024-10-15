import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import * as gameService from '../services/api/gameService.js';
import Router from '../router.js';
import State from '../State.js';
import Socket from '../services/Socket.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIManager = null;
	}

	async init() {
		const content = await Router.loadTemplate('game');
		document.getElementById('app').innerHTML = content;

		//await this.getLocalGame();

		const tournament = State.get('tournament');
		const currentMatchIndex = tournament.currentMatchIndex;
		const matches = tournament.matches;

		this.game = new PongGame(matches[currentMatchIndex].socket);
		this.UIManager = new UIManager();
	}

	update() {
		//this.game.update();
		this.UIManager.update();
	}


}
