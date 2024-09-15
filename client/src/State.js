import { initState } from "./constants.js";
import { deepCopy } from "./utils/utils.js";
// import { UIManager } from "./components/UIManager.js";

class State {
    constructor() {
        this.data = deepCopy(initState);
    }

    get(path) {
        const keys = path.split('.');
        let result = this.data;
        for (let key of keys) {
            result = result?.[key];
            if (result === undefined) break;
        }
        return deepCopy(result);
    }

    set(path, value) {
        const keys = path.split('.');
        let result = this.data;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in result) || typeof result[key] !== 'object') {
                result[key] = {};
            }
            result = result[key];
        }

        result[keys[keys.length - 1]] = value;
        // UIManager.updateUI(this.get('path'));
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

    reset() {
        this.data = initState;
    }
}

export default new State();