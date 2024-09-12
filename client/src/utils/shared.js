export const GameModes = {
	SINGLE: 'single',
	MULTI: 'multi',
	ONLINE: 'online',
};

export const settings = {
	pointsToWin: 5,
	numberOfGames: 1,
	username: "",
	mode: GameModes.SINGLE
};

export const GameStates = {
	WAITING_TO_START: 'waitingToStart',
	COUNTDOWN: 'countdown',
	RUNNING: 'running',
	FINISHED: 'finished',
	MATCH_ENDED: 'matchEnded'
};

export let players = [];