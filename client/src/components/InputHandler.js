import { GameModes } from "../constants.js";

export default class InputHandler {
	constructor(game) {
		this.game = game;
		this.currentlyPressedKeys = {};
		this.boundHandleKeyDown = this.handleKeyDown.bind(this);
		this.boundHandleKeyUp = this.handleKeyUp.bind(this);
		this.boundPreventDefaultScroll = this.preventDefaultScroll.bind(this);
		this.init();
	}

	init() {
		document.addEventListener('keydown', this.boundHandleKeyDown);
		document.addEventListener('keyup', this.boundHandleKeyUp);
		window.addEventListener('keydown', this.boundPreventDefaultScroll);
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

	destroy() {
		// Remove all event listeners
		document.removeEventListener('keydown', this.boundHandleKeyDown);
		document.removeEventListener('keyup', this.boundHandleKeyUp);
		window.removeEventListener('keydown', this.boundPreventDefaultScroll);

		// Clear any references
		this.game = null;
		this.currentlyPressedKeys = null;

		console.log('InputHandler destroyed');
	}
}
