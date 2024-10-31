import { debug } from '../utils/utils.js'

export function setCookie(name, value, hoursToLive) {
	const date = new Date();
	// date.setTime(date.getTime() +  (10000));
	date.setTime(date.getTime() +  (hoursToLive * 60 * 60 * 1000));
	let expires = "expires=" + date.toUTCString();
	document.cookie = `${name}=${value}; ${expires}; path=/`
}

export function deleteCookie(name) {
	setCookie(name, null, null);
}

export function deleteAllCookies() {
	const cookies = getAllCookies();
	
	Object.keys(cookies).forEach(cookieName => {
		deleteCookie(cookieName);
	});

	debug("All cookies deleted");
}

export function getCookie(name) {
	const cDecoded = decodeURIComponent(document.cookie);
	const cArray = cDecoded.split("; ");
	let result = null;
	
	cArray.forEach(element => {
		if(element.indexOf(name) == 0) {
			result = element.substring(name.length + 1)
		}
	})
	return result;
}

export function getAllCookies() {
	const cDecoded = decodeURIComponent(document.cookie);
	const cArray = cDecoded.split("; ");
	const cookies = {};
	
	cArray.forEach(cookie => {
		if (cookie) {
			const [name, value] = cookie.split("=");
			cookies[name] = value;
		}
	});
	
	return cookies;
}