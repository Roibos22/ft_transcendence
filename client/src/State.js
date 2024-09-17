import { initState } from "./constants.js";
import { deepCopy } from "./utils/utils.js";
import { currentView } from "./constants.js";

class State {
    constructor() {
        this.data = this.initState();
    }

    initState() {
        const {user, userData, gameSettings, currentMatchInfo, gameData, tournament } = deepCopy(initState);
        return {
            user,
            userData,
            gameSettings,
            currentMatchInfo,
            gameData,
            tournament
        };
    }

    get(...args) {
        let path = this.data;
        args.forEach(key => {
            if (path[key] === undefined) {
                console.error('Path not found');
            }
            path = path[key];
        });
        return deepCopy(path);
    }

    set(...args) {
        if (args.length < 2) {
            throw new Error('Path, key, or value is missing');
        }
    
        const value = deepCopy(args.pop());

        let path = this.data;
        const lastKey = args.pop();
        args.forEach(key => {
            if (path[key] === undefined) {
                console.error('Path not found');
            }
            path = path[key];
        });

        path[lastKey] = value;
        currentView.view.update();
    }

    reset() {
        this.data = this.initState();
    }
}

export default new State();