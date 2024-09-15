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
	path: '/',
	user: {
		username: "",
		authToken: "",
		refreshToken: ""
	},
	gameSettings: {
		pointsToWin: 5,
		numberOfGames: 1,
		mode: GameModes.SINGLE,
		displayType: GameTypes.TWO_D
	},
	currentMatchInfo: {
		players: [],
		player1pos: 0,
		player2pos: 0,
		ball: {
			x: 0,
			y: 0,
		},
		player1score: 0,
		player2score: 0
	},
	gamePhase: GamePhases.WAITING_TO_START,
	tournament: {
		players: [],
		currentMatchIndex: 0,
		matches: [],
		currentMatch: {}
	},
};
