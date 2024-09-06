import { initLoginView } from './views/login.js';
import { initRegisterView } from './views/register.js';
import { initGameSetupView } from './views/gameSetup.js';
import { initGameView } from './views/game.js';

// Create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		template: "/templates/404.html",
		title: "404 | ",
		description: "Page not found",
	},
	"/": {
		template: "../templates/login.html",
		title: "Home | ",
		description: "This is the home page",
	},
	"/register": {
		template: "../templates/register.html",
		title: "Register | ",
		description: "This is the registration page",
	},
	"/game-setup": {
		template: "../templates/game-setup.html",
		title: "Game Setup | ",
		description: "This is the game setup page",
	},
	"/game": {
		template: "../templates/game.html",
		title: "Game | ",
		description: "This is the game page",
	},
};

// Function to handle URL changes
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

// Function to initialize the current view based on the URL
export function initCurrentView() {
	console.log("init current View called");
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

// Function to handle navigation
const urlRoute = (event) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

// Set up click event listener for navigation
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

// Set up popstate event listener for browser back/forward navigation
window.onpopstate = urlLocationHandler;

// Expose urlRoute function globally
window.route = urlRoute;

// Initial call to handle the URL on page load
urlLocationHandler();