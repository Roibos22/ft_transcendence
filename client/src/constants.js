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
	THREE_D: '3D'
};

export const GamePhases = {
	WAITING_TO_START: 'waitingToStart',
	COUNTDOWN: 'countdown',
	RUNNING: 'running',
	FINISHED: 'finished', // I think this is redundant
	MATCH_ENDED: 'game_over'
};

export const initState = {
	user: {
		username: "",
		displayName: "",
		onlineStatus: false
	},
	ThreeD: {
		spritesLoaded: false,
	},
	gameSettings: {
		displayType: GameTypes.TWO_D,
		mode: GameModes.SINGLE
	},
	gameData: {
		constants: {
			mapHeight: 0,
			mapWidth: 0,
			player1Username: "",
			player2Username: "",
			paddleHeight: 0,
			paddleWidth: 0,
			ballRadius: 0,
			winner: ""
		},
		phase: GamePhases.WAITING_TO_START,
		player1Score: 0,
		player2Score: 0,
		player1Pos: 0,
		player2Pos: 0,
		player1Dir: 0,
		player2Dir: 0,
		player1Ready: false,
		player2Ready: false,
		countdown: -1,
		ball: {
			x: 0,
			y: 0,
			velocity: {
				x: 0,
				y: 0
			}
		}
	},
	tournament: {
		players: null,
		matches: null,
		pointsToWin: 5,
		numberOfGames: 1,
		currentMatchIndex: 0,
		completed: false
	}
};
