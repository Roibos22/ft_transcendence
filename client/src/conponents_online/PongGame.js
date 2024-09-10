export class PongGame {
	constructor() {
		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		
		this.gameState = {
			leftPaddle: {
				x: 0,
				y: this.canvas.height / 2 - 50,
				width: 10,
				height: 100
			},
			rightPaddle: {
				x: this.canvas.width - 10,
				y: this.canvas.height / 2 - 50,
				width: 10,
				height: 100
			},
			ball: {
				x: this.canvas.width / 2,
				y: this.canvas.height / 2,
				radius: 5,
				dx: 0,
				dy: 0,
				speed: 8
			},
			gameStarted: false,
			canvasWidth: this.canvas.width,
			canvasHeight: this.canvas.height,
			paddleSpeed: 5
		};

		this.keysPressed = {};

		this.init();
	}

	init() {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		this.gameLoop();

		// TODO: WebSocket connection setup
		// this.setupWebSocket();
	}

	// TODO: WebSocket setup method
	// setupWebSocket() {
	//     this.socket = new WebSocket('ws://your-server-url');
	//     this.socket.onmessage = this.handleWebSocketMessage.bind(this);
	// }

	// TODO: WebSocket message handler
	// handleWebSocketMessage(event) {
	//     const data = JSON.parse(event.data);
	//     switch(data.type) {
	//         case 'gameStart':
	//             this.startGame(data.ballDirection);
	//             break;
	//         case 'paddleUpdate':
	//             this.updateOpponentPaddle(data.paddleY);
	//             break;
	//         case 'ballUpdate':
	//             this.updateBallPosition(data.ball);
	//             break;
	//     }
	// }

	handleKeyDown(e) {
		this.keysPressed[e.key] = true;
		if (e.key === 'Enter' && !this.gameState.gameStarted) {
			this.startGame();
		}
	}

	handleKeyUp(e) {
		this.keysPressed[e.key] = false;
	}

	startGame() {
		this.gameState.gameStarted = true;
		const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
		this.gameState.ball.dx = Math.cos(angle) * this.gameState.ball.speed;
		this.gameState.ball.dy = Math.sin(angle) * this.gameState.ball.speed;
		
		// TODO: Emit 'startGame' event
		// this.socket.send(JSON.stringify({ type: 'startGame' }));
	}

	updatePaddles() {
		const moveDistance = this.gameState.paddleSpeed;

		if (this.keysPressed['w']) {
			this.gameState.leftPaddle.y = Math.max(0, this.gameState.leftPaddle.y - moveDistance);
		}
		if (this.keysPressed['s']) {
			this.gameState.leftPaddle.y = Math.min(this.canvas.height - this.gameState.leftPaddle.height, this.gameState.leftPaddle.y + moveDistance);
		}

		// For local game, update both paddles
		if (this.keysPressed['ArrowUp']) {
			this.gameState.rightPaddle.y = Math.max(0, this.gameState.rightPaddle.y - moveDistance);
		}
		if (this.keysPressed['ArrowDown']) {
			this.gameState.rightPaddle.y = Math.min(this.canvas.height - this.gameState.rightPaddle.height, this.gameState.rightPaddle.y + moveDistance);
		}

		// TODO: Emit 'paddleUpdate' event
		// this.socket.send(JSON.stringify({ type: 'paddleUpdate', paddleY: this.gameState.leftPaddle.y }));
	}

	// TODO: Method to update opponent's paddle position
	// updateOpponentPaddle(paddleY) {
	//     this.gameState.rightPaddle.y = paddleY;
	// }

	updateBall() {
		if (!this.gameState.gameStarted) return;

		this.gameState.ball.x += this.gameState.ball.dx;
		this.gameState.ball.y += this.gameState.ball.dy;

		// Ball collision with top and bottom walls
		if (this.gameState.ball.y - this.gameState.ball.radius < 0 || 
			this.gameState.ball.y + this.gameState.ball.radius > this.gameState.canvasHeight) {
			this.gameState.ball.dy = -this.gameState.ball.dy;
		}

		// Ball collision with paddles
		if (
			(this.gameState.ball.x - this.gameState.ball.radius < this.gameState.leftPaddle.x + this.gameState.leftPaddle.width &&
			 this.gameState.ball.y > this.gameState.leftPaddle.y && 
			 this.gameState.ball.y < this.gameState.leftPaddle.y + this.gameState.leftPaddle.height) ||
			(this.gameState.ball.x + this.gameState.ball.radius > this.gameState.rightPaddle.x &&
			 this.gameState.ball.y > this.gameState.rightPaddle.y && 
			 this.gameState.ball.y < this.gameState.rightPaddle.y + this.gameState.rightPaddle.height)
		) {
			this.gameState.ball.dx = -this.gameState.ball.dx;
		}

		// Ball out of bounds
		if (this.gameState.ball.x < 0 || this.gameState.ball.x > this.gameState.canvasWidth) {
			this.resetBall();
		}

		// TODO: Emit 'ballUpdate' event
		// this.socket.send(JSON.stringify({ type: 'ballUpdate', ball: this.gameState.ball }));
	}

	resetBall() {
		this.gameState.ball.x = this.gameState.canvasWidth / 2;
		this.gameState.ball.y = this.gameState.canvasHeight / 2;
		this.gameState.ball.dx = 0;
		this.gameState.ball.dy = 0;
		this.gameState.gameStarted = false;
		
		// TODO: Emit 'resetBall' event
		// this.socket.send(JSON.stringify({ type: 'resetBall' }));
	}

	draw() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.gameState.canvasWidth, this.gameState.canvasHeight);

		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(this.gameState.leftPaddle.x, this.gameState.leftPaddle.y, this.gameState.leftPaddle.width, this.gameState.leftPaddle.height);
		this.ctx.fillRect(this.gameState.rightPaddle.x, this.gameState.rightPaddle.y, this.gameState.rightPaddle.width, this.gameState.rightPaddle.height);

		this.ctx.beginPath();
		this.ctx.arc(this.gameState.ball.x, this.gameState.ball.y, this.gameState.ball.radius, 0, Math.PI * 2);
		this.ctx.fillStyle = 'white';
		this.ctx.fill();
		this.ctx.closePath();
	}

	gameLoop() {
		this.updatePaddles();
		this.updateBall();
		this.draw();
		requestAnimationFrame(() => this.gameLoop());
	}
}

// Usage:
// const game = new PongGame();