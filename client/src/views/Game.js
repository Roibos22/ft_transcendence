import { PongGame } from '../components/PongGame.js';
import { UIManager } from '../components/UIManager.js';
import Router from '../router.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIManager = null;
	}

	async init() {
        const content = await Router.loadTemplate('game');
        document.getElementById('app').innerHTML = content;

		this.game = new PongGame();
		this.UIManager = new UIManager();
	}

	update() {
		this.game.update();
		this.UIManager.update();
	}
}
