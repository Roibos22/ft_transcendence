import { GameTypes } from "../constants";
import { GameModes, GamePhases } from "../constants";

export class State {
    constructor() {
        this.data = this.initState();
        this.listeners = {};
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.notify(key);
    }

    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    notify(key) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(this.data[key]));
        }
    }

    initState() {
        return {
            user: {
                username: "",
                authToken: "",
                refreshToken: "",
            },
            matchSettings: {
                pointsToWin: 5,
                mode: GameModes.SINGLE,
                displayType: GameTypes.TWO_D,
            },
            currentMatchInfo: {
                player1pos: 0,
                player2pos: 0,
                ball: {
                    x: 0,
                    y: 0,
                },
                player1score: 0,
                player2score: 0,
            },
            currentGamePhase: GamePhases.WAITING_TO_START,
            tournament: {
                numberOfGames: 1,
                currentMatchIndex: 0,
                matches: [],
            },
        };
    }
}