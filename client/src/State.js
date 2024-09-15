import { initState } from "./constants.js";
import { deepCopy } from "./utils/utils.js";
import { UIManager } from "./components/UIManager.js";

class State {
    constructor() {
        this.view = null;
        this.info = {}
        this.user = {}
        this.gameSettings = {}
        this.currentMatchInfo = {}
        this.tournament = {}

        this.data = initState();
    }

    initState() {
        const initStateCopy = deepCopy(initState);

        this.info = initStateCopy.info;
        this.user = initStateCopy.user;
        this.gameSettings = initStateCopy.gameSettings;
        this.currentMatchInfo = initStateCopy.currentMatchInfo;
        this.tournament = initStateCopy.tournament;

        return {
            info: this.info,
            user: this.user,
            gameSettings: this.gameSettings,
            currentMatchInfo: this.currentMatchInfo,
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
        return deepCopy(this.data[path]);
    }

    get(path, key) {
        if (path === undefined || key === undefined) {
            console.error('Path and key are required');
        }
        return this.data[path][key];
    }

    set(path, value) {
        this.data[path] = value;

        this.notify(path);
    }

    set(path, key, value) {
        this.data[path][key] = value;

        this.notify(path);
    }

    notify(valuePath) {
        const viewPath = this.info.path;
        if (valuePath === 'gameSettings') {
            UIManager.updateGame();
            return;
        }
        if (viewPath === '/game' || viewPath === '/game-setup') {
            UIManager.update(viewPath, valuePath);
        }
    }

    reset() {
        this.initState();
    }
}

export default new State();