import { initCurrentView, urlLocationHandler } from './router.js';

function initMain() {
	document.addEventListener('DOMContentLoaded', function() {
		initCurrentView();
	});
}

initMain();