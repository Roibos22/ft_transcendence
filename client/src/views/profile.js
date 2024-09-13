import { loadTemplate } from '../router.js';
import * as Notification from '../services/notification.js';
import * as UserService from '../services/api/userService.js';

export async function initProfileView() {
	try {
		const content = await loadTemplate('profile');
		document.getElementById('app').innerHTML = content;

		const userData = await UserService.fetchUserData();
		populateProfile(userData);
		setupEditSave();
		//setupDeleteUser();
	} catch (error) {
		Notification.showErrorNotification(["Failed to load profile", "Please try again later"]);
	}
}

function populateProfile(data) {
	document.getElementById('displayName').textContent = data.display_name;
	document.getElementById('username').textContent = '@' + data.username;
	document.getElementById('displayNameDisplay').textContent = data.display_name;
	document.getElementById('firstNameDisplay').textContent = data.first_name;
	document.getElementById('lastNameDisplay').textContent = data.last_name;
	document.getElementById('emailDisplay').textContent = data.email;
	document.getElementById('phoneNumberDisplay').textContent = data.phone_number || 'Not provided';
	document.getElementById('dateJoined').textContent = new Date(data.date_joined).toLocaleDateString();
	document.getElementById('lastLogin').textContent = data.last_login ? new Date(data.last_login).toLocaleDateString() : 'Never';
	document.getElementById('emailVerified').textContent = data.email_verified ? 'Yes' : 'No';
	updateOnlineStatus(data.online);
	updateAvatar(data);
}

function updateAvatar(data) {
	const avatarImg = document.getElementById('avatarImg');

	if (data.avatar) {
		avatarImg.src = data.avatar;
	} 
	// else {
	//     avatarImg.src = './default_avatar.png'; // Make sure to have a default avatar image
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
	
	saveBtn.addEventListener('click', async function() {
		saveBtn.style.display = 'none';
		editBtn.style.display = 'inline-block';
		
		const updatedData = {
			first_name: document.getElementById('firstNameInput').value,
			last_name: document.getElementById('lastNameInput').value,
			email: document.getElementById('emailInput').value,
			phone_number: document.getElementById('phoneNumberInput').value,
			display_name: document.getElementById('displayNameInput').value
		};

		try {
			const newUserData = await UserService.updateUserData(updatedData);
			populateProfile(newUserData);
			// Switch back to display mode
			personalInfo.querySelectorAll('.infoField').forEach(container => {
				const span = container.querySelector('span');
				const input = container.querySelector('input');
				input.classList.add('d-none');
				span.classList.remove('d-none');
			});
		} catch (error) {
			console.error('Failed to update profile:', error);
			// Error notification is handled in UserService.updateUserData
		}
	});
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
// 			await UserService.deleteUserAccount();
// 			deleteUserModal.hide();
// 			// Redirect to login page
// 			window.location.href = '/login';
// 		} catch (error) {
// 			console.error('Error deleting user:', error);
// 			// Error notification is handled in UserService.deleteUserAccount
// 		}
// 	});
// }