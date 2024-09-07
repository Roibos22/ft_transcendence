// router.js
const routes = {
	'/': { viewId: 'loginView', filePath: './views/login.html' },
	'/register': { viewId: 'registrationView', filePath: './views/register.html' },
	'/setup': { viewId: 'gameSetupView', filePath: './views/game-setup.html' },
	'/game': { viewId: 'gameView', filePath: './views/game.html' }
};

function createRouter(initGame) {
	async function loadView(filePath) {
		console.log('Attempting to load:', filePath);
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const content = await response.text();
			console.log('View content loaded successfully');
			return content;
		} catch (error) {
			console.error("Could not load view:", error);
			return null;
		}
	}

	async function router() {
		const path = window.location.hash.slice(1) || '/';
		console.log('Router called. Current path:', path);
		const route = routes[path] || routes['/'];
		console.log('Matched route:', route);
	
		const content = await loadView(route.filePath);
		if (content === null) {
			console.error('Failed to load content for path:', path);
			return;
		}
	
		const appDiv = document.getElementById('app');
		if (!appDiv) {
			console.error('Could not find #app element');
			return;
		}
		console.log('Updating app div content');
		appDiv.innerHTML = content;
	
		if (path === '/setup') {
			console.log('Initializing game...');
			initGame(localStorage.getItem('username'));
		}
	
		if (typeof window.onViewLoaded === 'function') {
			console.log('Calling onViewLoaded...');
			window.onViewLoaded();
		} else {
			console.log('onViewLoaded is not defined or not a function');
		}
	}
	
	function initRouter() {
		console.log('Initializing router...');
		window.removeEventListener('hashchange', router);  // Remove any existing listeners
		window.addEventListener('hashchange', router);
		console.log('Router initialized, calling initial route');
		router(); // Call once to handle initial route
	}

	return { initRouter };
}

export { createRouter };