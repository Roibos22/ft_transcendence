import { players, settings } from '../utils/shared.js';
import { PongGame } from '../components/PongGame.js';
import { Tournament } from '../components/Tournament.js';
import { loadTemplate } from '../router.js';

export async function initGameView() {
	const content = await loadTemplate('game');
	document.getElementById('app').innerHTML = content;

	const game = new PongGame(settings);
	game.tournament = new Tournament(game, players, settings);
	game.startGame();
}