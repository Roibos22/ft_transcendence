import TwoD from "./TwoD.js";
import ThreeD from "./ThreeD/ThreeD.js";
import State from "../State.js";
import { GameTypes } from "../constants.js";
import OnlineInputHandler from "../conponents_online/OnlineInputHandler.js";

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
		this.gameSocket = socket;

		this.init();
	}

	init() {
		this.twoD = new TwoD(this);
		this.threeD = new ThreeD(this);

		if (this.gameSocket) {
			this.inputHandler = new OnlineInputHandler(this);
		}

		this.update();
	}

	update() {
		State.get("gameSettings", "displayType") === GameTypes.TWO_D ? this.twoD.show() : this.twoD.hide();
		State.get("gameSettings", "displayType") === GameTypes.THREE_D ? this.threeD.show() : this.threeD.hide();
	}
}