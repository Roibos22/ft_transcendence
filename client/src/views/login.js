import { urlLocationHandler, loadTemplate } from '../router.js';
import * as Cookies from '../utils/cookies.js';

export async function initLoginView() {
	const content = await loadTemplate('login');
	document.getElementById('app').innerHTML = content;

	const loginForm = document.getElementById('loginForm');
	const loginError = document.getElementById('loginError');

	if (loginForm) {
		loginForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			const username = document.getElementById('username').value;
			const password = document.getElementById('password').value;
			
			const loginSuccess = await loginUser(username, password);
			
			if (loginSuccess) {
				window.history.pushState({}, "", "/game-setup");
				urlLocationHandler();
			}
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

async function loginUser(username, password) {
	try {
		const response = await fetch('http://localhost:8000//users/login/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			displayLoginError(errorData);
			console.log(errorData);
			throw new Error('Login failed');
		}

		const data = await response.json();
		console.log("Login successful");
		Cookies.setCookie("accessToken", data.access, 24);
		Cookies.setCookie("refreshToken", data.refresh, 24);
		return true;
	} catch (error) {
		console.error('Login error:', error);
		return false;
	}
}

function displayLoginError(errorData) {
	const loginError = document.getElementById('loginError');
	loginError.style.display = 'block';
	let errorMessages = [];

	if (errorData.username) {
		// Username may not be blank
		errorMessages.push(`Username: ${errorData.username[0]}`);
	}
	if (errorData.password) {
		// Password may not be blank
		errorMessages.push(`Password: ${errorData.password[0]}`);
	}
	if (errorData.detail) {
		// Password and Username do not match
		errorMessages.push(errorData.detail);
	}
	if (errorMessages.length === 0) {
		errorMessages.push('An error occurred during login. Please try again.');
	}
	
	loginError.innerHTML = errorMessages.join('<br>');
}