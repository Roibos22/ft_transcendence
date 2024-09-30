import State from "../State.js";
import { GameModes, GameTypes } from "../constants.js";

export default class InputHandler {
	constructor(game) {
		this.game = game;
		this.socket = null;
		this.init();
	}

	init() {
		console.log(State.get("gameSettings", "mode"));
		switch(State.get("gameSettings", "mode")) {
			case GameModes.SINGLE:
				//document.addEventListener('keydown', (e) => this.handleKeyDownSingle(e));
				//document.addEventListener('keyup', (e) => this.handleKeyUpSingle(e));
				break;
			case GameModes.MULTI:
				//document.addEventListener('keydown', (e) => this.handleKeyDownMulti(e));
				//document.addEventListener('keyup', (e) => this.handleKeyUpMulti(e));
				break;
			case GameModes.ONLINE:
				document.addEventListener('keydown', (e) => this.handleKeyDownOnline(e));
				document.addEventListener('keyup', (e) => this.handleKeyUpOnline(e));
				break;
		} 
		window.addEventListener('keydown', (e) => this.preventDefaultScroll(e));
	}

	preventDefaultScroll(e) {
		if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
			e.preventDefault();
		}
	}

	// SINGLE

	handleKeyDownSingle(e) {
		switch(e.key) {
			case 'w':
				this.game.engine.setPlayerDirection(1, -1);
				break;
			case 's':
				this.game.engine.setPlayerDirection(1, 1);
				break;
			case 'ArrowUp':
				this.game.engine.setPlayerDirection(2, -1);
				break;
			case 'ArrowDown':
				this.game.engine.setPlayerDirection(2, 1);
				break;
			case 'Enter':
				//this.handleEnterKey();
				break;

		}
	}

	handleKeyUpSingle(e) {
		switch(e.key) {
			case 'w':
			case 's':
				this.game.engine.setPlayerDirection(1, 0);
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				this.game.engine.setPlayerDirection(2, 0);
				break;
		}
	}

	// MULTI

	// ONLINE

	handleKeyDownOnline(e) {
		if (this.socket) {
			switch(e.key) {
				case 'ArrowUp':
					this.socket.send(JSON.stringify({ action: 'move_player', direction: '-1' }));
					break;
				case 'ArrowDown':
					this.socket.send(JSON.stringify({ action: 'move_player', direction: '1' }));
					break;
				case 'Enter':
					this.socket.send(JSON.stringify({ action: 'player_ready' }));
					break;
			}
		} else {
			console.log("No Socket Connected");
		}
	}

	handleKeyUpOnline(e) {
		if (this.socket) {
			switch(e.key) {
				case 'ArrowUp':
				case 'ArrowDown':
					this.socket.send(JSON.stringify({
						action: 'move_player',
						direction: '0' }));
					break;
			}
		} else {
			console.log("No Socket Connected");
		}
	}
}

	//handleEnterKey() {
		// if (this.game.state.waitingForEnter) {
		// 	if (State.get('gameData', 'phase') === GamePhases.MATCH_ENDED) {
		// 		incrementCurrentMatchIndex();
		// 		this.game.State.startNextMatch();
		// 		this.game.State.startCountdown();
		// 	} else if (State.get('gameData', 'phase') === GamePhases.FINISHED) {
		// 		console.log("TOURNAMENT COMPLETED");
		// 		// Add logic to restart the tournament or return to main menu
		// 	} else {
		// 		this.game.State.startCountdown();
		// 	}
		// 	this.game.State.waitingForEnter = false;
		// }
//	}
//}