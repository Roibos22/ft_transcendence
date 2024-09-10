import { API_BASE_URL, fetchWithAuth } from './api.js';
import * as Cookies from '../utils/cookies.js';
import * as Notification from '../utils/notification.js';

const userApi = {
	fetchProfile: (username) => fetchWithAuth(`${API_BASE_URL}/users/profile/${username}/`),
	updateProfile: (userId, updatedData) => fetchWithAuth(`${API_BASE_URL}/users/profile/${userId}/update/`, {
		method: 'PATCH',
		body: JSON.stringify(updatedData)
	}),
	deleteUser: (username) => fetchWithAuth(`${API_BASE_URL}/users/delete/${username}/`, {
		method: 'DELETE'
	}),
};

export async function fetchUserData() {
	try {
		const username = Cookies.getCookie("username");
		if (!username) {
			throw new Error("Username not found in cookies");
		}
		return await userApi.fetchProfile(username);
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}

export async function updateUserData(updatedData) {
	try {
		const userId = Cookies.getCookie("userId");
		if (!userId) {
			throw new Error("User ID not found in cookies");
		}
		await userApi.updateProfile(userId, updatedData);
		const newUserData = await fetchUserData();
		Notification.showNotification(["Profile updated successfully"]);
		return newUserData;
	} catch (error) {
		console.error('Error updating user data:', error);
		Notification.showErrorNotification(["Failed to update profile", "Please try again later"]);
		throw error;
	}
}

export async function deleteUserAccount() {
	try {
		const username = Cookies.getCookie("username");
		if (!username) {
			throw new Error("Username not found in cookies");
		}
		await userApi.deleteUser(username);
		Cookies.deleteCookie("username");
		Cookies.deleteCookie("userId");
		Cookies.deleteCookie("accessToken");
		Notification.showNotification(["Account deleted successfully"]);
	} catch (error) {
		console.error('Error deleting user account:', error);
		Notification.showErrorNotification(["Failed to delete account", "Please try again later"]);
		throw error;
	}
}