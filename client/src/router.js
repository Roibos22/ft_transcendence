import { currentView } from './constants.js';
import { urlRoutes } from './utils/routeUtils.js';

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
    const ViewClass = urlRoutes[currentPath].view;

    if (!ViewClass) {
        window.history.pushState({}, "", "/404");
        return;
    }

    delete currentView.view;
    currentView.view = new ViewClass();

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