import { urlLocationHandler, loadTemplate } from '../router.js';

export async function initLoginView() {
	const content = await loadTemplate('login');
	document.getElementById('app').innerHTML = content;

	const loginForm = document.getElementById('loginForm');
	if (loginForm) {
		loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const username = document.getElementById('username').value;
			window.history.pushState({}, "", "/game-setup");
			urlLocationHandler();
		});
	}

	const showRegistrationLink = document.getElementById('showRegistration');
	if (showRegistrationLink) {
		showRegistrationLink.addEventListener('click', function(e) {
			e.preventDefault();
			window.history.pushState({}, "", "/register");
			urlLocationHandler();
		});
	}
}