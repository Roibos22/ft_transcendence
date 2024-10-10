import TwoD from "./TwoD.js";
import ThreeD from "./ThreeD/ThreeD.js";
import State from "../State.js";
import InputHandler from "./InputHandler.js";
import AIPlayer from "./AIPlayer.js";
import * as Cookies from '../services/cookies.js';
import { GameModes, GameTypes } from "../constants.js";

export class PongGame {
	static instance = null;

	constructor(socket) {
		if (PongGame.instance) {
			console.warn('PongGame instance already exists. Returning existing instance.');
			return PongGame.instance;
		}

		this.twoD = null;
		this.threeD = null;
		this.inputHandler = null;
		this.AIplayer = null;
		this.tournament = null;
		this.socket = socket;
		this.gameMode = Cookies.getCookie("gameMode");

		this.init();
		PongGame.instance = this;
	}

	init() {
		console.log('PongGame init called');
		this.twoD = new TwoD(this);
		//this.threeD = new ThreeD(this);
		this.inputHandler = new InputHandler(this);
		this.twoD.show(); // Ensure the canvas is visible
		this.startStateLogging();
	}

	startStateLogging() {
		this.stateLoggingInterval = setInterval(() => {
			console.log('Current State:', State);
		}, 2000);
	}

	update() {
		if (this.twoD) {
			this.twoD.update();
		}
		
		if (!this.AIplayer && this.gameMode === GameModes.SINGLE) {
			console.log('AIPlayer created');
			this.AIplayer = new AIPlayer(this);
		}
	}

	cleanup() {
        if (this.twoD) {
            this.twoD.cleanup();
        }
        if (this.inputHandler) {
            this.inputHandler.cleanup();
        }
        if (this.AIplayer) {
            this.AIplayer.cleanup();
        }
        if (this.stateLoggingInterval) {
            clearInterval(this.stateLoggingInterval);
        }
        PongGame.instance = null;
    }
}