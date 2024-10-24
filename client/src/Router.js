import { currentView } from './constants.js';
import { urlRoutes } from './utils/routeUtils.js';
import * as Cookies from './services/cookies.js';
import * as Notification from './services/notification.js';

class Router {
	constructor() {
		this.routes = urlRoutes;
		this.init();
	}

	init() {
		window.onpopstate = this.handleLocationChange.bind(this);
		document.addEventListener("click", (e) => this.handleLinkClick(e));
		this.handleLocationChange();
	}

	async handleLocationChange() {
		let location = window.location.pathname;
		if (location.length === 0) {
			location = "/";
		}

		const route = this.routes[location] || this.routes["404"];
		
		if (route === this.routes["404"]) {
			await this.loadView(route);
			return;
		}

		if (!route.public) {
			if (!this.validateToken()) {
				history.pushState(null, "", "/");
				await this.loadView(this.routes["/"]);
				Notification.showErrorNotification(["Session Expired", "Please log in again"]);
				return;
			}
		}
		await this.loadView(route);
	}

	async loadView(route) {
		try {
			const html = await fetch(route.template).then(response => response.text());
			document.getElementById("app").innerHTML = html;
			document.title = route.title;
			this.initCurrentView(window.location.pathname);
		} catch (error) {
			console.error('Error loading view:', error);
			const notFoundHtml = await fetch(this.routes["404"].template).then(response => response.text());
			document.getElementById("app").innerHTML = notFoundHtml;
			document.title = this.routes["404"].title;
		}
	}

	validateToken() {
		return Cookies.getCookie("accessToken");
	}

	handleLinkClick(event) {
		const { target } = event;
		if (target.matches("nav a, a[href^='/']")) {
			event.preventDefault();
			window.history.pushState({}, "", target.href);
			this.handleLocationChange();
		}
	}

	async initCurrentView(location) {
		const route = this.routes[location] || this.routes["404"];
		const ViewClass = route.view;

		if (currentView.view && typeof currentView.view.cleanup === 'function') {
			if (currentView.view instanceof ViewClass) {
				console.log("Same View loaded. no cleanup called");
				return;
			}
			currentView.view.cleanup();
		}
	
		delete currentView.view;
		currentView.view = new ViewClass();
	
		await currentView.view.init();
	}

	async loadTemplate(name) {
		const response = await fetch(`/templates/${name}.html`);
		return await response.text();
	}
}

export default new Router();
