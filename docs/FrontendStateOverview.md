# Frontend State/Constants

state = {
    user: {
        //todo
    },
    matchSettings: {
        pointsToWin: number,
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
        numberOfGames: number,
        currentMatchIndex,
        previousMatches: [MatchResult]
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