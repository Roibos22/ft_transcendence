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
			await displayLoginError(response);
			return false;
		}
		const data = await response.json();
		setupUserAfterLogin(username, password, data);
		return true;

	} catch (error) {
		console.error('Login error:', error);
		return false;
	}
}

function setupUserAfterLogin(username, password, data) {
	Cookies.setCookie("accessToken", data.access, 24);
	Cookies.setCookie("refreshToken", data.refresh, 24);
	Cookies.setCookie("username", username, 24);
	console.log(data);
}

async function displayLoginError(response) {
	const loginError = document.getElementById('loginError');
	loginError.style.display = 'block';
	let errorMessages = [];

	const errorData = await response.json();
	console.log(errorData);
	console.log(`Response status code: ${response.status}`);

	if (response.status == 400) {
		errorMessages.push(`Username and Password field may not be empty.`);
	} else if (response.status == 401) {
		errorMessages.push(`Username and Password do not match.`);
	} else {
		errorMessages.push(`Something went wrong.`);
	}
	errorMessages.push(`Please try again.`);
	
	loginError.innerHTML = errorMessages.join('<br>');
}