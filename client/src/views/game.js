import { PongGame } from '../components/PongGame.js';
import { Tournament } from '../components/Tournament.js';
import { loadTemplate } from '../router.js';
import state from '../State.js';

export class GameView {
	constructor() {
		this.game = null;
		this.UIelements = null;
	}

	async init() {
		console.log(state.data)
        const content = await loadTemplate('game');
        document.getElementById('app').innerHTML = content;
	}

	startGame() {
		this.game = new PongGame();
		this.game.tournament = new Tournament(this.game);
		this.game.startGame();
	}
}

export async function initGameView() {
	const view = new GameView();
 	await view.init();
	view.startGame();
}