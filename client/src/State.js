import { initState } from "./constants.js";
import { deepCopy } from "./utils/utils.js";
import { currentView } from "./constants.js";

class State {
    constructor() {
        this.user = {};
        this.gameSettings = {};
        this.currentMatchInfo = {};
        this.gameData = {};
        this.tournament = {}

        this.data = this.initState();
    }

    initState() {
        const initStateCopy = deepCopy(initState);

        this.user = initStateCopy.user;
        this.gameSettings = initStateCopy.gameSettings;
        this.currentMatchInfo = initStateCopy.currentMatchInfo;
        this.tournament = initStateCopy.tournament;

        return {
            user: this.user,
            gameSettings: this.gameSettings,
            currentMatchInfo: this.currentMatchInfo,
            gameData: this.gameData,
            tournament: this.tournament
        }
    }

    getState() {
        return this.data;
    }

    get(path) {
        if (path === undefined) {
            console.error('Path is required');
        }
        if(this.data[path] === undefined) {
            console.error('Path not found');
        }
        return deepCopy(this.data[path]);
    }

    get(path, key) {
        if (path === undefined || key === undefined) {
            console.error('Path and key are required');
        }
        if(this.data[path] === undefined) {
            console.error('Path not found');
        }
        if(this.data[path][key] === undefined) {
            console.error('Key not found');
        }
        return this.data[path][key];
    }

    set(path, value) {
        if (path === undefined || value === undefined) {
            console.error('Path and value are required');
        }
        if(this.data[path] === undefined) {
            console.error('Path not found');
        }
        this.data[path] = value;

        this.notify(path);
    }

    set(path, key, value) {
        if (path === undefined || key === undefined || value === undefined) {
            console.error('Path, key, and value are required');
        }
        if(this.data[path] === undefined) {
            console.error('Path not found');
        }
        if(this.data[path][key] === undefined) {
            console.error('Key not found');
        }
        this.data[path][key] = value;

        currentView.view.update();
    }

    reset() {
        this.initState();
    }
}

export default new State();