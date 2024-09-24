
import TwoD from "./TwoD.js";
import InputHandler from "./InputHandler.js";

export class PongGame {
	constructor() {
		this.field = null;

		this.twoD = null;
		this.threeD = null;

		this.inputHandler = null;
		this.engine = null;

		this.init();

		this.tournament = null;
	}

	init() {
		this.field = {
			width: 1000,
			height: 500,
		};

		this.twoD = new TwoD(this);
		// this.threeD = new ThreeD(canvas);

		this.inputHandler = new InputHandler();
		// this.engine = state.get('gameSettings', 'mode') === '' ? new Engine() : null;
	}

	update() {
	}
}
