import { initLoginView } from './views/login.js';
import { initRegisterView } from './views/register.js';
import { initGameSetupView } from './views/gameSetup.js';
import { initGameView } from './views/game.js';

const urlRoutes = {
	404: {
		template: "/templates/404.html",
	},
	"/": {
		template: "../templates/login.html",
	},
	"/register": {
		template: "../templates/register.html",
	},
	"/game-setup": {
		template: "../templates/game-setup.html",
	},
	"/game": {
		template: "../templates/game.html",
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
	
	initCurrentView();
};

export function initCurrentView() {
	const currentPath = window.location.pathname;
	if (currentPath === '/' || currentPath === '/login') {
		initLoginView();
	} else if (currentPath === '/register') {
		initRegisterView();
	} else if (currentPath === '/game-setup') {
		initGameSetupView();
	} else if (currentPath === '/game') {
		initGameView();
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