import { initCurrentView, urlLocationHandler } from './router.js';

function initMain() {
	window.addEventListener('popstate', urlLocationHandler);
}

initMain();