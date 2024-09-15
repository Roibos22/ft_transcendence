export const currentView = {
	view: null
};

export const GameModes = {
	SINGLE: 'single',
	MULTI: 'multi',
	ONLINE: 'online'
};

export const GameTypes = {
	TWO_D: '2D',
	THREE_D: '3D',
	CLI: 'CLI'
};

export const GamePhases = {
	WAITING_TO_START: 'waitingToStart',
	COUNTDOWN: 'countdown',
	RUNNING: 'running',
	FINISHED: 'finished',
	MATCH_ENDED: 'matchEnded'
};

export const initState = {
	view: {
		path: '/',
		displayType: GameTypes.TWO_D
	},
	user: {
		username: "",
		authToken: "",
		refreshToken: ""
	},
	gameSettings: {
		pointsToWin: 5,
		numberOfGames: 1,
		mode: GameModes.SINGLE,
	},
	currentMatchInfo: {
		players: [],
		player1score: 0,
		player2score: 0
	},
	gameData: {
		phase: GamePhases.WAITING_TO_START,
		player1pos: 0,
		player2pos: 0,
		ball: {
			x: 0,
			y: 0,
		},
	},
	tournament: {
		players: [],
		currentMatchIndex: 0,
		matches: [],
		currentMatch: {}
	},
};
