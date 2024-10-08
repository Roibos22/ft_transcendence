import { GameModes } from "../constants.js";

export default class InputHandler {
	constructor(game) {
		this.game = game;
		this.init();
		this.currentlyPressedKeys = {};
	}

	init() {
		document.addEventListener('keydown', (e) => this.handleKeyDown(e));
		document.addEventListener('keyup', (e) => this.handleKeyUp(e));
		window.addEventListener('keydown', (e) => this.preventDefaultScroll(e));
	}

	preventDefaultScroll(e) {
		if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
			e.preventDefault();
		}
	}

	handleKeyDown(e) {
		if (!this.isSocketConnected()) return;
	
		const keyActions = {
			'ArrowUp': { action: 'move_player', player_no: '2', direction: '-1' },
			'ArrowDown': { action: 'move_player', player_no: '2', direction: '1' },
			'w': { action: 'move_player', player_no: '1', direction: '-1' },
			's': { action: 'move_player', player_no: '1', direction: '1' },
			' ': { action: 'player_ready', player_no: '1' },
			'Enter': { action: 'player_ready', player_no: '2' }
		};

		if (this.game.gameMode === GameModes.SINGLE) {
			delete keyActions['ArrowUp'];
			delete keyActions['ArrowDown'];
		}
	
		if (keyActions[e.key] && !this.currentlyPressedKeys[e.key]) {
			this.sendSocketMessage(keyActions[e.key]);
			this.currentlyPressedKeys[e.key] = true;
		}
	}
	
	handleKeyUp(e) {
		if (!this.isSocketConnected()) return;
	
		const keyReleaseActions = ['w', 's', 'ArrowUp', 'ArrowDown'];
	
		if (keyReleaseActions.includes(e.key)) {
			const player_no = ['w', 's'].includes(e.key) ? '1' : '2';
			this.sendSocketMessage({ action: 'move_player', player_no, direction: '0' });
			this.currentlyPressedKeys[e.key] = false;
		}
	}

	isSocketConnected() {
		if (!this.game.socket) {
			console.log("No Socket Connected");
			return false;
		}
		return true;
	}
	
	sendSocketMessage(message) {
		this.game.socket.send(JSON.stringify(message));
	}
}
