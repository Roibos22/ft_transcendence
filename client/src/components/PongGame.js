import TwoD from "./TwoD.js";
import ThreeD from "./ThreeD/ThreeD.js";
import State from "../State.js";
import InputHandler from "./InputHandler.js";
// import Engine from "./Engine.js";
import * as Cookies from '../services/cookies.js';
import { GameModes, GameTypes } from "../constants.js";

export class PongGame {
	constructor(socket) {

		this.field = {
			width: 1000,
			height: 500,
		};

		this.twoD = null;
		this.threeD = null;
		this.inputHandler = null;
		this.tournament = null;
		this.socket = socket;
		this.gameMode = Cookies.getCookie("gameMode");

		this.init();
	}

	init() {
		this.twoD = new TwoD(this);
		this.threeD = new ThreeD(this);
		this.inputHandler = new InputHandler(this);
		this.engine = this.gameMode === GameModes.MULTI ? new Engine() : null;
	
		this.update();
	}

	update() {
		State.get("gameSettings", "displayType") === GameTypes.TWO_D ? this.twoD.show() : this.twoD.hide();
		State.get("gameSettings", "displayType") === GameTypes.THREE_D ? this.threeD.show() : this.threeD.hide();
	}
}