import { loadTemplate } from '../router.js';
import * as Notification from '../services/notification.js';
import * as UserService from '../services/api/userService.js';
import state from '../State.js';

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
		this.setupEditSave();

		try {
			const userData = await UserService.fetchUserData();
			console.log('User data:', userData);
			state.set('userData', userData);
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
				displayName: {
					display: document.getElementById('displayNameDisplay'),
					input: document.getElementById('displayNameInput'),
				},
				firstName: {
					display: document.getElementById('firstNameDisplay'),
					input: document.getElementById('firstNameInput'),
				},
				lastName: {
					display: document.getElementById('lastNameDisplay'),
					input: document.getElementById('lastNameInput'),
				},
				email: {
					display: document.getElementById('emailDisplay'),
					input: document.getElementById('emailInput'),
				},
				phoneNumber: {
					display: document.getElementById('phoneNumberDisplay'),
					input: document.getElementById('phoneNumberInput'),
				}
			},
			buttons: {
				edit: document.getElementById('editBtn'),
				save: document.getElementById('saveBtn'),
				delete: document.getElementById('deleteUserBtn'),
				confirmDelete: document.getElementById('confirmDeleteBtn')
			}
		};
	}

	update() {
		this.userData = state.get('userData');
		this.populateProfile();
		this.updateOnlineStatus();
		this.updateAvatar();
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

		personalInfo.displayName.display.textContent = data.display_name;
		personalInfo.firstName.display.textContent = data.first_name;
		personalInfo.lastName.display.textContent = data.last_name;
		personalInfo.email.display.textContent = data.email;
		personalInfo.phoneNumber.display.textContent = data.phone_number || 'Not provided';

	}

	updateAvatar() {
		const avatarImg = this.UIelements.card.avatar;

		if (this.userData.avatar) {
			avatarImg.src = userData.avatar;
		} 
		// else {
		//     avatarImg.src = './default_avatar.png'; // Make sure to have a default avatar image
		// }
	}

	updateOnlineStatus() {
		const onlineStatusElement = this.UIelements.card.onlineStatus;
		const isOnline = this.userData.is_online;
		
		onlineStatusElement.textContent = isOnline ? 'Online' : 'Offline';
		onlineStatusElement.classList.remove(isOnline ? 'bg-danger' : 'bg-success');
		onlineStatusElement.classList.add(isOnline ? 'bg-success' : 'bg-danger');
	}

	setupEditSave() {
		const editBtn = this.UIelements.buttons.edit;
		const saveBtn = this.UIelements.buttons.save;
		const personalInfo = this.UIelements.personalInfo;

		editBtn.addEventListener('click', () => {
			editBtn.style.display = 'none';
			saveBtn.style.display = 'inline-block';

			// Switch to edit mode
			Object.values(personalInfo).forEach(info => {
				info.display.classList.add('d-none');
				info.input.classList.remove('d-none');
				info.input.value = info.display.textContent;
			});
		});

		saveBtn.addEventListener('click', async () => {
			saveBtn.style.display = 'none';
			editBtn.style.display = 'inline-block';

			const updatedData = {
				first_name: personalInfo.firstName.input.value,
				last_name: personalInfo.lastName.input.value,
				email: personalInfo.email.input.value,
				phone_number: personalInfo.phoneNumber.input.value,
				display_name: personalInfo.displayName.input.value
			};

			try {
				Object.values(personalInfo).forEach(info => {
					info.display.classList.remove('d-none');
					info.input.classList.add('d-none');
				});
				const newUserData = await UserService.updateUserData(updatedData);
				this.userData = newUserData;
				this.populateProfile();
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