import { LoginView } from './views/login.js';
import { GameSetupView } from './views/gameSetup.js';
import { GameView } from './views/game.js';
import { RegisterView } from './views/register.js';
import { ProfileView } from './views/profile.js';
// import { GameOnlineView } from './views/gameOnline.js';
import { currentView } from './constants.js';

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
	}
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

export async function initCurrentView() {
	const currentPath = window.location.pathname;
	
	delete currentView.view;

	switch (currentPath) {
		case "/":
		case "/login":
			currentView.view = new LoginView();
			break;
		case "/register":
			currentView.view = new RegisterView();
			break;
		case "/game-setup":
			currentView.view = new GameSetupView();
			break;
		case "/game":
			currentView.view = new GameView();
			break;
		case "/profile":
			currentView.view = new ProfileView();
			break;
		// case "/online-game":
		// 	currentView.view = new GameOnlineView();
		// 	break;
		default:
			window.history.pushState({}, "", "/404");
			return;
	}

	await currentView.view.init();
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