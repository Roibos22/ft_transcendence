# Frontend State/Constants

state = {
    view: {
        path: string,
        displayType: GameType
    },
    user: {
        username: string,
        authToken: string,
        refreshToken: string
    },
    gameSettings: {
        pointsToWin: number,
        numberOfGames: number,
        mode: GameMode
    },
    currentMatchInfo: {
        players: [],
        player1score: number,
        player2score: number,
    },
    gameData: {
        phase: GamePhases,
        player1position: number,
        player2position: number,
        ball: {
            x: number,
            y: number
        }
    },
    tournament: {
        players: [],
        currentMatchIndex: number,
        previousMatches: [MatchResult]
        currentMatch: {}
    }
}

GameMode = {
    SINGLE: ‘single,’
    MULTI: ‘multi’,
    ONLINE: ‘online’
}

GameTypes = {
    TWO_D: ‘2D’,
    THREE_D: ‘3D’,
    CLI: ‘CLI’
}

MatchResult  = {
    winner: number,
    player1score: number,
    player2score: number
}