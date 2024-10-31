import { currentView } from './constants.js';
import { urlRoutes } from './utils/routeUtils.js';
import * as Cookies from './services/cookies.js';
import * as Notification from './services/notification.js';
import * as UserService from './services/api/userService.js';
import State from './State.js';

class Router {
	constructor() {
		this.routes = urlRoutes;
		this.currentPath = null;
		this.init();
	}

	init() {
		window.onpopstate = this.handleLocationChange.bind(this);
		document.addEventListener("click", (e) => this.handleLinkClick(e));
		this.handleLocationChange();
	}

	getValidLocation() {
		const location = window.location.pathname;
		return location.length === 0 ? "/" : location;
	}

	handleAuthRoutes(location) {
		if (location === "/" || location === "/register") {
			State.reset();
			Cookies.deleteAllCookies();
		}
	}

	async handleUnauthenticatedAccess() {
		history.pushState(null, "", "/");
		await this.loadView(this.routes["/"]);
		Notification.showErrorNotification(["Session Expired", "Please log in again"]);
	}

	async handleLocationChange() {
		const location = this.getValidLocation();
		this.handleAuthRoutes(location);

		if (this.currentPath === location) { return; }

		const route = this.routes[location] || this.routes["404"];
		
		if (route === this.routes["404"]) {
			await this.loadView(route);
			return;
		}

		if (!route.public && !(await this.validateToken())) {
			await this.handleUnauthenticatedAccess(route);
			return;
		}

		this.currentPath = location;
		await this.loadView(route);
	}

	async loadViewContent(route) {
		const response = await fetch(route.template);
		const html = await response.text();
		document.getElementById("app").innerHTML = html;
		document.title = route.title;
	}

	async handleError() {
		const notFoundHtml = await fetch(this.routes["404"].template);
		document.getElementById("app").innerHTML = await notFoundHtml.text();
		document.title = this.routes["404"].title;
	}

	async loadView(route) {
		try {
			await this.loadViewContent(route);
			await this.initCurrentView(route);
		} catch (error) {
			console.error('Error loading view:', error);
			await this.handleError();
		}
	}

	async validateToken() {
		if (!Cookies.getCookie('accessToken'))
			return false;
		try {
			await UserService.fetchUserData();
		} catch (error) {
			console.error('Error validating token');
			return false;
		}
		return true;
	}

	isNavigationLink(target) {
		return target.matches("nav a, a[href^='/']");
	}

	shouldSkipNavigation(newPath) {
		return this.currentPath === newPath;
	}

	handleLinkClick(event) {
		const { target } = event;
		if (!this.isNavigationLink(target)) return;

		event.preventDefault();
		const newPath = new URL(target.href).pathname;
		
		if (this.shouldSkipNavigation(newPath)) { return; }

		window.history.pushState({}, "", target.href);
		this.handleLocationChange();
	}

	shouldSkipViewInitialization(ViewClass) {
		return currentView.view instanceof ViewClass;
	}

	cleanupCurrentView(ViewClass) {
		if (!currentView.view?.cleanup) return;
		if (currentView.view instanceof ViewClass) { return; }
		currentView.view.cleanup();
	}

	async initCurrentView(route) {
		const ViewClass = route.view;

		if (this.shouldSkipViewInitialization(ViewClass)) { return; }

		this.cleanupCurrentView(ViewClass);
		
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
