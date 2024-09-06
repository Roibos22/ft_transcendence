import { urlLocationHandler, loadTemplate } from '../router.js';

export async function initRegisterView() {
	const content = await loadTemplate('register');
	document.getElementById('app').innerHTML = content;

	const showLoginLink = document.getElementById('showLogin');
	if (showLoginLink) {
		showLoginLink.addEventListener('click', function(e) {
			e.preventDefault();
			window.history.pushState({}, "", "/");
			urlLocationHandler();
		});
	}
}