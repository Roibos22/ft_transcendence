import { loadTemplate } from '../router.js';
import * as Cookies from '../utils/cookies.js';
import * as Notification from '../utils/notification.js';

export async function initProfileView() {
	try {
		const content = await loadTemplate('profile');
		document.getElementById('app').innerHTML = content;

		const userData = await fetchUserData();
		populateProfile(userData);
		setupEditSave();
		setupDeleteUser();

		setupEditSave();
	} catch (error) {
		console.error('Error initializing profile view:', error);
	}
}

async function fetchUserData() {
	try {
		const username = Cookies.getCookie("username");
		const accessToken = Cookies.getCookie("accessToken");

		if (!username || !accessToken) {
			throw new Error("Username or access token not found in cookies");
		}

		const response = await fetch(`http://localhost:8000/users/profile/${username}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}


function populateProfile(data) {
	document.getElementById('displayName').textContent = data.display_name;
	document.getElementById('username').textContent = '@' + data.username;
	document.getElementById('onlineStatus').textContent = data.online ? 'Online' : 'Offline';
	document.getElementById('firstNameDisplay').textContent = data.first_name;
	document.getElementById('lastNameDisplay').textContent = data.last_name;
	document.getElementById('emailDisplay').textContent = data.email;
	document.getElementById('phoneNumberDisplay').textContent = data.phone_number || 'Not provided';
	document.getElementById('dateJoined').textContent = new Date(data.date_joined).toLocaleDateString();
	document.getElementById('lastLogin').textContent = data.last_login ? new Date(data.last_login).toLocaleDateString() : 'Never';
	document.getElementById('emailVerified').textContent = data.email_verified ? 'Yes' : 'No';
	updateOnlineStatus()
	const avatarImg = document.getElementById('avatarImg');
	if (data.avatar) {
		avatarImg.src = data.avatar;
	} 
	// else {
	// 	avatarImg.src = './default_avatar.png'; // Make sure to have a default avatar image
	// }
}

function updateOnlineStatus(isOnline) {
	const onlineStatusElement = document.getElementById('onlineStatus');
	
	if (isOnline) {
		onlineStatusElement.textContent = 'Online';
		onlineStatusElement.classList.remove('bg-danger');
		onlineStatusElement.classList.add('bg-success');
	} else {
		onlineStatusElement.textContent = 'Offline';
		onlineStatusElement.classList.remove('bg-success');
		onlineStatusElement.classList.add('bg-danger');
	}
}

function setupEditSave() {
	const editBtn = document.getElementById('editBtn');
	const saveBtn = document.getElementById('saveBtn');
	const personalInfo = document.getElementById('personalInfo');
	
	editBtn.addEventListener('click', function() {
		editBtn.style.display = 'none';
		saveBtn.style.display = 'inline-block';
		
		// Switch to edit mode
		personalInfo.querySelectorAll('.infoField').forEach(container => {
			const span = container.querySelector('span');
			const input = container.querySelector('input');
			span.classList.add('d-none');
			input.classList.remove('d-none');
			input.value = span.textContent;
		});
	});
	
	saveBtn.addEventListener('click', function() {
		saveBtn.style.display = 'none';
		editBtn.style.display = 'inline-block';
		
		// Switch to display mode and update values
		personalInfo.querySelectorAll('.infoField').forEach(container => {
			const span = container.querySelector('span');
			const input = container.querySelector('input');
			input.classList.add('d-none');
			span.classList.remove('d-none');
			span.textContent = input.value;
		});
		
		updateUserData();
	});
}

async function updateUserData() {
	const updatedData = {
		first_name: document.getElementById('firstNameInput').value,
		last_name: document.getElementById('lastNameInput').value,
		email: document.getElementById('emailInput').value,
		phone_number: document.getElementById('phoneNumberInput').value
	};

	try {
		// TODO: change to user_name once available
		const response = await fetch(`http://localhost:8000/users/profile/1/update/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${Cookies.getCookie("accessToken")}`
			},
			body: JSON.stringify(updatedData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
	} catch (error) {
		Notification.showErrorNotification([
			"Something went wrong...",
			"Please try again.",
		]);
	}
	
	const userData = await fetchUserData();
	populateProfile(userData);
}


// function setupDeleteUser() {
// 	const deleteUserBtn = document.getElementById('deleteUserBtn');
// 	const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
// 	const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));

// 	deleteUserBtn.addEventListener('click', () => {
// 		deleteUserModal.show();
// 	});

// 	confirmDeleteBtn.addEventListener('click', async () => {
// 		try {
// 			await deleteUser();
// 			deleteUserModal.hide();
// 			// Redirect to login page or show success message
// 			window.history.pushState({}, "", "/login");
// 			urlLocationHandler();
// 		} catch (error) {
// 			console.error('Error deleting user:', error);
// 			// Show error message to user
// 		}
// 	});
// }



// async function deleteUser() {
// 	const username = Cookies.getCookie("username");
// 	const accessToken = Cookies.getCookie("accessToken");

// 	if (!username || !accessToken) {
// 		throw new Error("Username or access token not found in cookies");
// 	}

// 	const response = await fetch(`http://localhost:8000/users/delete/${username}/`, {
// 		method: 'DELETE',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': `Bearer ${accessToken}`
// 		}
// 	});

// 	if (!response.ok) {
// 		const errorData = await response.json();
// 		throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
// 	}

// 	// Clear cookies and any stored user data
// 	Cookies.deleteCookie("username");
// 	Cookies.deleteCookie("accessToken");
// 	Cookies.deleteCookie("refreshToken");

// 	return true;
// }