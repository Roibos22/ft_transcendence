import { initState } from "./constants.js";
import { deepCopy } from "./utils/utils.js";
import { currentView } from "./constants.js";

class State {
    constructor() {
        this.data = {};
        this.init();
    }

    async init() {
        this.data = deepCopy(initState);
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
        this.init();
    }
}

export default new State();