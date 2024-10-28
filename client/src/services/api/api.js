import * as Cookies from '../cookies.js';

export const API_BASE_URL = 'https://localhost:8443/api';

export async function fetchWithAuth(url, options = {}) {
	const accessToken = Cookies.getCookie("accessToken");
	console.log("Access Token:", accessToken);
	if (!accessToken) {
		throw new Error("Access token not found in cookies");
	}

	const defaultOptions = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`
		}
	};

	const response = await fetch(url, { ...defaultOptions, ...options });

	if (!response.ok) {
		const errorData = await response.json();
		console.error("Response status:", response.status);
		console.error("Response headers:", response.headers);
		console.error("Error data:", errorData);
		throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
	}

	return response.json();
}

export async function fetchWithoutAuth(url, options = {}) {

	const defaultOptions = {
		headers: {
			'Content-Type': 'application/json',
		}
	};

	const response = await fetch(url, { ...defaultOptions, ...options });

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
	}

	return response.json();
}
