import { GameModes, GameTypes } from '../constants.js';

export const settings = {
	pointsToWin: 5,
	numberOfGames: 1,
	username: "",
	mode: GameModes.SINGLE,
	type: GameTypes['2D']
};

export let players = [];