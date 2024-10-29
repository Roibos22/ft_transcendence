import { GameView } from "../views/GameView.js";
import { GameSetupView } from "../views/GameSetupView.js";
import { LoginView } from "../views/LoginView.js";
import { OnlineGameLoadingView } from "../views/OnlineLoadingView.js";
import { ProfileView } from "../views/ProfileView.js";
import { RegisterView } from "../views/RegisterView.js";
import { LocalGameOverviewView } from "../views/LocalGameOverviewView.js";
import { NotFoundView } from "../views/NotFoundView.js";
import { TwoFactorView } from "../views/TwoFactor.js";

export const urlRoutes = {
	"/": {
		template: "../templates/login.html",
		title: "Login",
		view: LoginView,
		public: true
	},
	"/two-factor": {
		template: "../templates/two-factor.html",
		title: "Two Factor Authentication",
		view: TwoFactorView,
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
		view: LocalGameOverviewView,
		public: false
	},
	"404": {
		template: "../templates/404.html",
		title: "Page Not Found",
		view: NotFoundView,
		public: true
	}
};