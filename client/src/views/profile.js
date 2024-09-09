import { loadTemplate } from '../router.js';
import * as Cookies from '../utils/cookies.js';

export async function initProfileView() {
	try {
		const content = await loadTemplate('profile');
		document.getElementById('app').innerHTML = content;

		const userData = await fetchUserData();
		populateProfile(userData);

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
		console.log(data);
		return data;

	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error; // Re-throw the error so it can be handled by the calling function
	}
}

function populateProfile(data) {
	document.getElementById('displayName').textContent = data.display_name;
	document.getElementById('username').textContent = '@' + data.username;
	document.getElementById('onlineStatus').textContent = data.online ? 'Online' : 'Offline';
	document.getElementById('firstName').textContent = data.first_name;
	document.getElementById('lastName').textContent = data.last_name;
	document.getElementById('email').textContent = data.email;
	document.getElementById('phoneNumber').textContent = data.phone_number || 'Not provided';
	document.getElementById('dateJoined').textContent = new Date(data.date_joined).toLocaleDateString();
	document.getElementById('lastLogin').textContent = data.last_login ? new Date(data.last_login).toLocaleDateString() : 'Never';
	document.getElementById('emailVerified').textContent = data.email_verified ? 'Yes' : 'No';
	document.getElementById('accountStatus').textContent = data.is_active ? 'Active' : 'Inactive';
}

function setupEditSave() {
	const editBtn = document.getElementById('editBtn');
	const saveBtn = document.getElementById('saveBtn');
	
	if (editBtn && saveBtn) {
		editBtn.addEventListener('click', function() {
			// Add your edit logic here
			editBtn.style.display = 'none';
			saveBtn.style.display = 'inline-block';
			// Enable form fields for editing
		});

		saveBtn.addEventListener('click', function() {
			// Add your save logic here
			saveBtn.style.display = 'none';
			editBtn.style.display = 'inline-block';
			// Disable form fields and save changes
		});
	}
}