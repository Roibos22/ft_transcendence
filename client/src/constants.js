export const currentView = {
	path: '/',
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
	user: {
		username: "",
		displayName: "",
		authToken: "",
		refreshToken: ""
	},
	userData: {
	},
	gameSettings: {
		displayType: GameTypes.TWO_D,
		pointsToWin: 5,
		numberOfGames: 1,
		mode: GameModes.SINGLE,
	},
	currentMatch: {
		player1Name: "Player 1",
		player2Name: "Player 2",
		player1Score: 0,
		player2Score: 0,
		winner: "",
	},
	gameData: {
		phase: GamePhases.WAITING_TO_START,
		player1Pos: 0,
		player2Pos: 0,
		countdown: -1,
		ball: {
			x: 0,
			y: 0,
		},
	},
	tournament: {
		players: [],
		matches: [],
		currentMatchIndex: 0,
	},
};
