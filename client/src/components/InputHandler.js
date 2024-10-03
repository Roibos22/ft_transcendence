export default class InputHandler {
	constructor(game) {
		this.game = game;
		this.init();
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
		if (!this.game.socket) {
			console.log("No Socket Connected");
		}
			
		switch(e.key) {
			case 'w':
				this.game.socket.send(JSON.stringify({ action: `move_player`, player_no: '1', direction: '-1' }));
				break;
			case 's':
				this.game.socket.send(JSON.stringify({ action: `move_player`, player_no: '1', direction: '1' }));
				break;
			case 'ArrowUp':
				this.game.socket.send(JSON.stringify({ action: `move_player`, player_no: '2', direction: '-1' }));
				break;
			case 'ArrowDown':
				this.game.socket.send(JSON.stringify({ action: `move_player`, player_no: '2', direction: '1' }));
				break;
			case 'Space':
				this.game.socket.send(JSON.stringify({ action: 'player_ready', player_no: '1' }));
				break;
			case 'Enter':
				this.game.socket.send(JSON.stringify({ action: 'player_ready', player_no: '2' }));
				break;
		}
	}

	handleKeyUp(e) {
		if (!this.game.socket) {
			console.log("No Socket Connected");
		}

		if (!['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

		const player_no = e.key === 'w' || e.key === 's' ? '1' : '2';
		this.game.socket.send(JSON.stringify({
			action: 'move_player',
			player_no: player_no,
			direction: '0' }));
	}
}
