import { initLoginView } from './views/login.js';
import { initRegisterView } from './views/register.js';
import { initGameSetupView } from './views/gameSetup.js';
import { initGameView } from './views/game.js';
import { initProfileView } from './views/profile.js';
import { initGameOnlineView } from './views/onlineGame.js';
import { init3DView } from './views/pong_3d.js';

const urlRoutes = {
	"/": {
		template: "../templates/login.html",
		title: "Login"
	},
	"/register": {
		template: "../templates/register.html",
		title: "Register"
	},
	"/game-setup": {
		template: "../templates/game-setup.html",
		title: "Setup"
	},
	"/game": {
		template: "../templates/game.html",
		title: "Game"
	},
	"/profile": {
		template: "../templates/profile.html",
		title: "Profile"
	},
	"/online-game": {
		template: "../templates/online-game.html",
		title: "Game"
	},
	"/pong_3d": {
		template: "../templates/pong_3d.html",
		title: "3D"
	},
};

export const urlLocationHandler = async () => {
	let location = window.location.pathname;
	if (location.length == 0) {
		location = "/";
	}
	const route = urlRoutes[location] || urlRoutes["404"];
	
	const html = await fetch(route.template).then((response) => response.text());
	document.getElementById("app").innerHTML = html;
	document.title = route.title;
	
	console.log('urlLocationHandler');
	initCurrentView();
};

export async function initCurrentView() {
	console.log('initCurrentView');
	const currentPath = window.location.pathname;
	if (currentPath === '/' || currentPath === '/login') {
		initLoginView();
	} else if (currentPath === '/register') {
		initRegisterView();
	} else if (currentPath === '/game-setup') {
		initGameSetupView();
	} else if (currentPath === '/game') {
		initGameView();
	} else if (currentPath === '/profile') {
		initProfileView();
	} else if (currentPath === '/online-game') {
		initGameOnlineView();
	} else if (currentPath === '/pong_3d') {
		await init3DView();
	}
}

const urlRoute = (event) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

document.addEventListener("click", (e) => {
	const { target } = e;
	if (!target.matches("nav a, a[href^='/']")) {
		return;
	}
	e.preventDefault();
	urlRoute(e);
});

export async function loadTemplate(name) {
	const response = await fetch(`/templates/${name}.html`);
	return await response.text();
}

window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();