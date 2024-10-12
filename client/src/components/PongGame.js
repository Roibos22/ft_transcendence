import TwoD from "./TwoD.js";
import ThreeD from "./ThreeD/ThreeD.js";
import State from "../State.js";
import InputHandler from "./InputHandler.js";
import AIPlayer from "./AIPlayer.js";
import * as Cookies from '../services/cookies.js';
import { GameModes, GameTypes } from "../constants.js";

export class PongGame {
	constructor(socket) {

		this.map = {
			width: 1000,
			height: 500,
		};

		this.twoD = null;
		this.threeD = null;
		this.inputHandler = null;
		this.AIplayer = null;
		this.tournament = null;
		this.socket = socket;
		this.gameMode = Cookies.getCookie("gameMode");

		this.init();
	}

	init() {
		this.twoD = new TwoD(this);
		this.threeD = new ThreeD(this);
		this.inputHandler = new InputHandler(this);
		this.update();
	}

	update() {
		State.get("gameSettings", "displayType") === GameTypes.TWO_D ? this.twoD.show() : this.twoD.hide();
		State.get("gameSettings", "displayType") === GameTypes.THREE_D ? this.threeD.show() : this.threeD.hide();
		if (!this.AIplayer && this.gameMode === GameModes.SINGLE) {
			console.log('AIPlayer created');
			this.AIplayer = new AIPlayer(this);
		}
	}
}