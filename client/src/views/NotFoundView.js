import Router from '../Router.js';

export class NotFoundView {
	constructor() {}

	async init() {
		const content = await Router.loadTemplate('404');
		document.getElementById('app').innerHTML = content;
	}

	update() {}
	cleanup() {}
}