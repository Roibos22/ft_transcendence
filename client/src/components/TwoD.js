import State from '../State.js';

export default class TwoD {
    constructor(game) {
        this.canvas = null;
        this.ctx = null;
        this.game = game;

        this.init();
    }

    init() {
        console.log('TwoD init called');
        this.canvas = document.getElementById('gameCanvas2D');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Unable to get 2D context');
            return;
        }

        // Set canvas size
        this.canvas.width = State.get('gameData', 'constants', 'mapWidth') || 1000;
        this.canvas.height = State.get('gameData', 'constants', 'mapHeight') || 500;

        // Ensure the canvas is visible
        this.canvas.style.display = 'block';
        this.canvas.style.border = '1px solid red'; // Add a border to make it easier to see

		console.log('Canvas initialized:', this.canvas.width, 'x', this.canvas.height);
        console.log('Canvas visibility:', getComputedStyle(this.canvas).display);
        console.log('Canvas position:', this.canvas.getBoundingClientRect());
        console.log('Canvas parent:', this.canvas.parentElement);
        console.log('Canvas styles:', {
            position: getComputedStyle(this.canvas).position,
            top: getComputedStyle(this.canvas).top,
            left: getComputedStyle(this.canvas).left,
            zIndex: getComputedStyle(this.canvas).zIndex,
            backgroundColor: getComputedStyle(this.canvas).backgroundColor,
            border: getComputedStyle(this.canvas).border
        });
    }

    show() {
        if (this.canvas) {
            this.canvas.style.display = 'block';
            console.log('Canvas shown');
        }
    }

    hide() {
        if (this.canvas) {
            this.canvas.style.display = 'none';
            console.log('Canvas hidden');
        }
    }

    update() {
        if (!this.ctx) {
            console.error('Context not available for update');
            return;
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game elements
        this.drawBackground();
        this.drawPaddles();
        this.drawBall();

        console.log('Canvas updated');
    }

    drawBackground() {
        if (!this.ctx) return;
        this.ctx.fillStyle = '#33CB99';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        console.log('Background drawn');
    }

    drawPaddles() {
        if (!this.ctx) return;
        const paddleHeight = State.get('gameData', 'constants', 'paddleHeight') || 50;
        const paddleWidth = State.get('gameData', 'constants', 'paddleWidth') || 10;
        const player1PosState = State.get('gameData', 'player1Pos') || 0;
        const player2PosState = State.get('gameData', 'player2Pos') || 0;

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, player1PosState, paddleWidth, paddleHeight);
        this.ctx.fillRect(this.canvas.width - paddleWidth, player2PosState, paddleWidth, paddleHeight);
    }

    drawBall() {
        if (!this.ctx) return;
        const ball = State.get('gameData', 'ball');
        const ballRadius = State.get('gameData', 'constants', 'ballRadius') || 5;

        if (ball) {
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
}