
import TwoD from "./TwoD.js";
import ThreeD from "./ThreeD.js";
import InputHandler from "./InputHandler.js";
import state from "../State.js";
import { GameModes, GameTypes } from "../constants.js";
import OnlineInputHandler from "../conponents_online/OnlineInputHandler.js";

export class PongGame {
	constructor() {
		this.field = null;

		this.twoD = null;
		this.threeD = null;

		this.inputHandler = null;
		this.engine = null;

		this.init();

		this.tournament = null;
		this.update();
	}

	init() {
		this.field = {
			width: 1000,
			height: 500,
		};

		this.twoD = new TwoD(this);
		this.threeD = new ThreeD(this);

		this.inputHandler = state.get("gameSettings", "mode") === GameModes.ONLINE 
								? new OnlineInputHandler()
								: new InputHandler();

		// this.engine = state.get('gameSettings', 'mode') === '' ? new Engine() : null;
	}

	update() {
		state.get("gameSettings", "displayType") === GameTypes.TWO_D ? this.twoD.show() : this.twoD.hide();
		state.get("gameSettings", "displayType") === GameTypes.THREE_D ? this.threeD.show() : this.threeD.hide();
	}
}
