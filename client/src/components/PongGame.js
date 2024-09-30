import TwoD from "./TwoD.js";
import ThreeD from "./ThreeD/ThreeD.js";
import InputHandler from "./InputHandler.js";
import State from "../State.js";
import Engine from "./Engine.js";
import { GameModes, GameTypes } from "../constants.js";

export class PongGame {
	constructor() {

		this.field = {
			width: 1000,
			height: 500,
		};

		this.twoD = null;
		this.threeD = null;
		this.inputHandler = null;
		this.engine = null;
		this.tournament = null;

		this.init();
	}

	init() {
		this.twoD = new TwoD(this);
		this.threeD = new ThreeD(this);

		console.log(State.get("gameSettings", "mode"));
		this.inputHandler = new InputHandler(this);

		this.engine = State.get('gameSettings', 'mode') === GameModes.MULTI ? new Engine() : null;
		this.update();
	}

	update() {
		State.get("gameSettings", "displayType") === GameTypes.TWO_D ? this.twoD.show() : this.twoD.hide();
		State.get("gameSettings", "displayType") === GameTypes.THREE_D ? this.threeD.show() : this.threeD.hide();
	}
}