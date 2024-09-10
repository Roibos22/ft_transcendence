import * as Cookies from '../utils/cookies.js';

export const API_BASE_URL = 'http://localhost:8000';

export async function fetchWithAuth(url, options = {}) {
	const accessToken = Cookies.getCookie("accessToken");
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
		throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
	}

	return response.json();
}
