import { loadTemplate } from '../router.js';
import * as Notification from '../services/notification.js';
import * as UserService from '../services/api/userService.js';

export class ProfileView {
	constructor() {
		this.template = 'profile';
		this.UIelements = null;
		this.userData = null;
	}

	async init() {
		const content = await loadTemplate(this.template);
		document.getElementById('app').innerHTML = content;

		this.UIelements = this.getUIElements();

		try {
			this.userData = await UserService.fetchUserData();
			this.populateProfile(userData);
			this.setupEditSave();
			//setupDeleteUser();
		}
		catch (error) {
			Notification.showErrorNotification(["Failed to load profile", "Please try again later"]);
		}
	}

	getUIElements() {
		return {
			card: {
				avatar: document.getElementById('avatarImg'),
				displayName: document.getElementById('displayName'),
				username: document.getElementById('username'),
				onlineStatus: document.getElementById('onlineStatus'),
				emailVerified: document.getElementById('emailVerified'),
				dateJoined: document.getElementById('dateJoined'),
				lastLogin: document.getElementById('lastLogin'),
			},
			personalInfo : {
				displayName: document.getElementById('displayNameDisplay'),
				firstName: document.getElementById('firstNameDisplay'),
				lastName: document.getElementById('lastNameDisplay'),
				email: document.getElementById('emailDisplay'),
				phoneNumber: document.getElementById('phoneNumberDisplay'),
			},
			buttons: {
				edit: document.getElementById('editBtn'),
				save: document.getElementById('saveBtn'),
				delete: document.getElementById('deleteUserBtn'),
				confirmDelete: document.getElementById('confirmDeleteBtn')
			}
		};
	}

	populateProfile() {
		const data = this.userData;
		const card = this.UIelements.card;
		const personalInfo = this.UIelements.personalInfo;

		card.displayName.textContent = data.display_name;
		card.username.textContent = '@' + data.username;
		card.emailVerified.textContent = data.email_verified ? 'Yes' : 'No';
		card.dateJoined.textContent = new Date(data.date_joined).toLocaleDateString();
		card.lastLogin.textContent = data.last_login ? new Date(data.last_login).toLocaleDateString() : 'Never';

		personalInfo.displayName.textContent = data.display_name;
		personalInfo.firstName.textContent = data.first_name;
		personalInfo.lastName.textContent = data.last_name;
		personalInfo.email.textContent = data.email;
		personalInfo.phoneNumber.textContent = data.phone_number || 'Not provided';
		
		this.updateOnlineStatus(data.online);
		this.updateAvatar(data);

	}

	updateAvatar(data) {
		const avatarImg = this.UIelements.card.avatar;

		if (data.avatar) {
			avatarImg.src = data.avatar;
		} 
		// else {
		//     avatarImg.src = './default_avatar.png'; // Make sure to have a default avatar image
		// }
	}

	updateOnlineStatus(isOnline) {
		const onlineStatusElement = this.UIelements.card.onlineStatus;
		
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

	setupEditSave() {
		const editBtn = this.UIelements.buttons.edit;
		const saveBtn = this.UIelements.buttons.save;
		const personalInfo = this.UIelements.personalInfo;

		editBtn.addEventListener('click', () => {
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

		saveBtn.addEventListener('click', async () => {
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
				this.populateProfile(newUserData);
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