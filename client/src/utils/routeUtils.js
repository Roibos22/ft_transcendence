import { GameView } from "../views/Game.js";
import { GameSetupView } from "../views/GameSetup.js";
import { LoginView } from "../views/Login.js";
import { OnlineGameLoadingView } from "../views/OnlineLoading.js";
import { ProfileView } from "../views/Profile.js";
import { RegisterView } from "../views/Register.js";
import { LocalGameOverview } from "../views/LocalGameOverview.js";
import { NotFoundView } from "../views/NotFoundView.js";

export const urlRoutes = {
	"/": {
		template: "../templates/login.html",
		title: "Login",
		view: LoginView,
		public: true
	},
	"/register": {
		template: "../templates/register.html",
		title: "Register",
		view: RegisterView,
		public: true
	},
	"/game-setup": {
		template: "../templates/game-setup.html",
		title: "Setup",
		view: GameSetupView,
		public: false
	},
	"/game": {
		template: "../templates/game.html",
		title: "Game",
		view: GameView,
		public: false
	},
	"/profile": {
		template: "../templates/profile.html",
		title: "Profile",
		view: ProfileView,
		public: false
	},
	"/online-game": {
		template: "../templates/game.html",
		title: "Game",
		view: GameView,
		public: false
	},
	"/online-game-loading": {
		template: "../templates/online-game-loading.html",
		title: "Loading",
		view: OnlineGameLoadingView,
		public: false
	},
	"/local-game-overview": {
		template: "../templates/local-game-overview.html",
		title: "Overview",
		view: LocalGameOverview,
		public: false
	},
	"404": {
		template: "../templates/404.html",
		title: "Page Not Found",
		view: NotFoundView,
		public: true
	}
};