import { currentView } from './constants.js';
import { urlRoutes } from './utils/routeUtils.js';

class Router {
    constructor() {
        this.routes = urlRoutes;
        this.init();
    }

    init() {
        window.onpopstate = this.handleLocationChange.bind(this);
        document.addEventListener("click", (e) => this.handleLinkClick(e));
        this.handleLocationChange();  // Initial route load
    }

    async handleLocationChange() {
        let location = window.location.pathname;
        if (location.length === 0) {
            location = "/";
        }
        const route = this.routes[location] || this.routes["404"];
        
        const html = await fetch(route.template).then(response => response.text());
        document.getElementById("app").innerHTML = html;
        document.title = route.title;

        this.initCurrentView(location);
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
		const ViewClass = this.routes[location].view;
	
		if (!ViewClass) {
			window.history.pushState({}, "", "/404");
			return;
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
