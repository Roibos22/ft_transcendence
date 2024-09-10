import * as API from './api.js';
import * as Cookies from '../cookies.js';
import * as Notification from '../notification.js';

export async function loginUser(username, password) {
	try {
		const data = await API.fetchWithoutAuth(`${API.API_BASE_URL}/users/login/`, {
			method: 'POST',
			body: JSON.stringify({ username, password }),
		});
	} catch (error) {
		console.error('Login error:', error);
		Notification.showErrorNotification(["Login failed"]);
	}

	return data;
}

export async function fetchUserData() {
	try {
		const username = Cookies.getCookie("username");
		if (!username) {
			throw new Error("Username not found in cookies");
		}
		return await API.fetchWithAuth(`${API.API_BASE_URL}/users/profile/${username}/`);
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}

export async function updateUserData(updatedData) {
	try {
		//const username = Cookies.getCookie("username");
		const username = 1;
		if (!username) {
			throw new Error("User ID not found in cookies");
		}
		await API.fetchWithAuth(`${API.API_BASE_URL}/users/profile/${username}/update/`, {
			method: 'PATCH',
			body: JSON.stringify(updatedData)
		});
		const newUserData = await fetchUserData();
		Notification.showNotification(["Profile updated successfully"]);
		return newUserData;
	} catch (error) {
		Notification.showErrorNotification(["Failed to update profile", "Please try again later"]);
		throw error;
	}
}

// export async function deleteUserAccount() {
// 	try {
// 		const username = Cookies.getCookie("username");
// 		if (!username) {
// 			throw new Error("Username not found in cookies");
// 		}
// 		await API.fetchWithAuth(`${API.API_BASE_URL}/users/delete/${username}/`, {
// 			method: 'DELETE'
// 		});
// 		Cookies.deleteCookie("username");
// 		Cookies.deleteCookie("userId");
// 		Cookies.deleteCookie("accessToken");
// 		Notification.showNotification(["Account deleted successfully"]);
// 	} catch (error) {
// 		console.error('Error deleting user account:', error);
// 		Notification.showErrorNotification(["Failed to delete account", "Please try again later"]);
// 		throw error;
// 	}
// }