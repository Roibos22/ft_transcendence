// import Router from '../router.js';
// import Socket from '../services/Socket.js';
// import { UIManager } from '../components/UIManager.js';
// import { PongGame } from '../components/PongGame.js';
// import * as Cookies from '../services/cookies.js';
// import state from "../State.js";

// export class OnlineGameView {
// 	constructor() {
// 		this.gameSocket = null;
// 		this.game = null
// 		this.UIManager = null;
// 	}

// 	async init() {
// 		const content = await Router.loadTemplate('game');
// 		document.getElementById('app').innerHTML = content;

// 		//this.initGameSocket(Cookies.getCookie("gameId"));
// 		this.game = new PongGame(this.gameSocket);
// 		this.UIManager = new UIManager();
// 	}

// 	initGameData(data) {
// 		const oldData = state.get("gameDataConstants");
// 		var newData = {
// 			...oldData,
// 			mapHeight: data.map_height,
// 			mapWidth: data.map_width,
// 			player1Username: data.player1_username,
// 			player2Username: data.player2_username,
// 			paddleHeight: data.paddle_height,
// 			paddleWidth: data.paddle_width,
// 			ballRadius: data.ball_radius,
// 		}

// 		state.set('gameDataConstants', newData);
// 	}

// 	updateState(newState) {
// 		const oldData = state.get("gameData");

// 		var newData = {
// 			...oldData,
// 			gameId: newState.game_id,
// 			phase: newState.phase,
// 			countdown: newState.countdown,
// 			player1Pos: newState.player1_pos,
// 			player2Pos: newState.player2_pos,
// 			player1Ready: newState.player1_ready,
// 			player2Ready: newState.player2_ready,
// 			ball: {
// 				x: newState.ball.x || 0,
// 				y: newState.ball.y || 0,
// 				velocity: {
// 					x: newState.ball_velocity.x || 0,
// 					y: newState.ball_velocity.y || 0,
// 				}
// 			}
// 		}

// 		state.set('gameData', newData);
// 	}

// 	update() {
// 		this.UIManager.update();
// 		this.game.update();
// 	}
// }

