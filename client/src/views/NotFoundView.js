import Router from '../router.js';
import * as Notification from '../services/notification.js';

export class NotFoundView {
	constructor() {
		this.UIelements = null;
	}

	async init() {
		const content = await Router.loadTemplate('404');
		document.getElementById('app').innerHTML = content;
		
		// this.UIelements = this.getUIElements();
		// this.addEventListeners();
	}

	update() {}
	
	// getUIElements() {
	// 	return {
	// 		goHomeButton: document.getElementById('goHomeButton')
	// 	};
	// }

	// addEventListeners() {
	// 	this.UIelements.goHomeButton.addEventListener('click', (e) => {
	// 		e.preventDefault();
	// 		this.goToHome();
	// 	});
	// }

	// goToHome() {
	// 	window.history.pushState({}, "", "/");
	// 	Router.handleLocationChange();
	// 	Notification.showNotification(["Redirected to home page"]);
	// }

	// displayError(error) {
	// 	const errorElement = document.getElementById('notFoundError');
	// 	errorElement.style.display = 'block';
	// 	errorElement.textContent = `An error occurred: ${error.message}`;
	// }
}