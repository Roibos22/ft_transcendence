import { initState } from "../constants";
import { deepCopy } from "../utils/utils";

export class State {
    constructor() {
        this.data = deepCopy(initState);
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

    reset() {
        this.data = initState;
    }
}