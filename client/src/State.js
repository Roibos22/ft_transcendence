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
		return path;
	}

	set(...args) {
		const value = deepCopy(args.pop());

		let path = this.data;
		const firstKey = args;
		const lastKey = args.pop();
		args.forEach(key => {
			if (path[key] === undefined) {
				console.error('Path not found');
			}
			path = path[key];
		});

		path[lastKey] = value;
		if (firstKey === 'gameData') {
			return;
		}
		currentView.view.update();
	}

	reset() {
		this.init();
		console.log("State reseted", this.data);
	}
}

export default new State();