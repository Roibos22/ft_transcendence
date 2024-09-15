# Frontend State/Constants

state = {
    user: {
        //todo
    },
    gameSettings: {
        pointsToWin: number,
        numberOfGames: number,
        mode: GameMode,
        displayType: GameType
    },
    currentMatchInfo: {
        player1position: number,
        player2position: number,
        ball: {
            x: number,
            y: number
        }
        player1score: number,
        player2score: number,
    },
    tournament: {
        players: [],
        currentMatchIndex,
        previousMatches: [MatchResult]
        currentMatch{}
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