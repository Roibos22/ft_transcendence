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

	const registrationForm = document.getElementById('registrationForm');
	if (registrationForm) {
		registrationForm.addEventListener('submit', function(e) {
			e.preventDefault();
			handleRegistration();
		});
	}
}

async function handleRegistration() {
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
		//avatar: "",
		active: true
	};

	try {
		const response = await fetch('http://localhost:8000/users/create/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': 'Bearer <token>' // Uncomment and replace <token> if needed
			},
			body: JSON.stringify(userData)
		});

		if (response.ok) {
			const data = await response.json();
			console.log('User registered successfully:', data);
		} else {
			const errorData = await response.json();
			console.error('Registration failed:', errorData);
		}
	} catch (error) {
		console.error('Error during registration:', error);
	}
}