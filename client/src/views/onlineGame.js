import { loadTemplate } from '../router.js';
import { PongGame } from './../conponents_online/PongGame.js';

export async function initGameOnlineView() {
	const content = await loadTemplate('online-game');
	document.getElementById('app').innerHTML = content;

	const game = new PongGame();
}