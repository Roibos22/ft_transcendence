import { initCurrentView, urlLocationHandler } from './router.js';

function initMain() {
	window.onload = async () => {
		await initCurrentView();
	};
}

initMain();