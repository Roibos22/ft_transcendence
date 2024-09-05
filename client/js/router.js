// Define routes
const routes = {
	'/': 'loginView',
	'/register': 'registrationView',
	'/setup': 'gameSetupView',
	'/game': 'gameView'
};


function createRouter(initGame) {
	function router() {
		const path = window.location.hash.slice(1) || '/';
		const viewId = routes[path] || routes['/'];

		// Hide all views
		Object.values(routes).forEach(id => {
			document.getElementById(id).style.display = 'none';
		});

		// Show the current view
		document.getElementById(viewId).style.display = 'block';

		// Additional logic for specific routes
		if (path === '/setup') {
			initGame(localStorage.getItem('username'));
		}
	}

	// Initialize router
	function initRouter() {
		window.addEventListener('hashchange', router);
		router(); // Call once to handle initial route
	}

	return { initRouter };
}

export { createRouter };