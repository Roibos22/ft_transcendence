
import TwoD from "./TwoD.js";
import InputHandler from "./InputHandler.js";

export class PongGame {
	constructor() {
		this.twoD = null;
		this.threeD = null;

		this.inputHandler = null;
		this.engine = null;

		this.init();

		this.tournament = null;
	}

	init() {
		const canvas = document.getElementById('gameCanvas');

		this.twoD = new TwoD(canvas);
		// this.threeD = new ThreeD(canvas);

		this.inputHandler = new InputHandler();
		// this.engine = state.get('gameSettings', 'mode') === '' ? new Engine() : null;
	}

	update() {
		this.twoD.update();
		// this.threeD.update();
	}
}
