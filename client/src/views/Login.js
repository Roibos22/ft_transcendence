import Router from '../router.js';
import * as Cookies from '../services/cookies.js';
import * as UserService from '../services/api/userService.js';
import * as Notification from '../services/notification.js';

export class LoginView {
	constructor() {
		this.template = 'login';
		this.UIelements = null;
	}

	async init() {
		const content = await Router.loadTemplate(this.template);
        document.getElementById('app').innerHTML = content;
		
		this.UIelements = this.getUIElements();
		this.addEventListeners();
	}

	update() {}
	
	getUIElements() {
		return {
			loginForm: document.getElementById('loginForm'),
			showRegistrationLink: document.getElementById('showRegistration'),
			username: document.getElementById('username'),
			password: document.getElementById('password')
		};
	}

	addEventListeners() {
		this.UIelements.loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			await this.loginUser();
		});

		this.UIelements.showRegistrationLink.addEventListener('click', (e) => {
			e.preventDefault();
			window.history.pushState({}, "", "/register");
			Router.handleLocationChange();
		});
	}

	async loginUser() {
		const username = this.UIelements.username.value;
		const password = this.UIelements.password.value;
	
		try {
			const response = await UserService.loginUser(username, password);
	
			if (response.success) {
				const data = response.data;
				Cookies.setCookie("accessToken", data.tokens.access, 24);
				Cookies.setCookie("refreshToken", data.tokens.refresh, 24);
				Cookies.setCookie("username", data.username, 24);
				Notification.showNotification(["Login successful"]);
				window.history.pushState({}, "", "/game-setup");
				Router.handleLocationChange();
			} else {
				this.displayLoginError(response.error);
			}
		} catch (error) {
			console.error('Failed to login', error);
			this.displayLoginError(error);
		}
	}
	
	displayLoginError(error) {
		const loginError = document.getElementById('loginError');
		loginError.style.display = 'block';
		let errorMessages = [];
	
		if (error.message.includes("400")) {
			errorMessages.push(`Username and Password field may not be blank.`);
		} else if (error.message.includes("401")) {
			errorMessages.push(`Username and Password do not match.`);
		} else {
			errorMessages.push(`Something went wrong.`);
		}
		errorMessages.push(`Please try again.`);
		
		loginError.innerHTML = errorMessages.join('<br>');
	}
}
