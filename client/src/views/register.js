import { urlLocationHandler, loadTemplate } from '../router.js';
import * as UserService from '../services/api/userService.js';
import * as Notification from '../services/notification.js';

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

	const registrationForm = document.getElementById('registrationForm');
	if (registrationForm) {
		registrationForm.addEventListener('submit', function(e) {
			e.preventDefault();
			registerUser();
		});
	}
}


async function registerUser() {
	const firstName = document.getElementById('first_name_registration').value;
	const lastName = document.getElementById('last_name_registration').value;
	const username = document.getElementById('username_registration').value;
	const email = document.getElementById('email_registration').value;
	const password = document.getElementById('password_registration').value;

	const userData = {
		username: username,
		email: email,
		password: password,
		first_name: firstName,
		last_name: lastName,
		active: true
	};

	try {
		const response = await UserService.registerUser(userData);

		if (response.success) {
			const data = response.data;
			Notification.showNotification(["Registration successful"]);
			window.history.pushState({}, "", "/");
			urlLocationHandler();
		} else {
			displayRegistrationError(response.error);
		}
	} catch (error) {
		console.error('Failed to login', error);
		displayRegistrationError(error);
	}
}

function displayRegistrationError(error) {
	const loginError = document.getElementById('registrationError');
	loginError.style.display = 'block';
	let errorMessages = [];

	if (error.message.includes("400")) {
		errorMessages.push(`Username already taken`);
	} else {
		errorMessages.push(`Something went wrong.`);
	}
	errorMessages.push(`Please try again.`);
	
	loginError.innerHTML = errorMessages.join('<br>');
}