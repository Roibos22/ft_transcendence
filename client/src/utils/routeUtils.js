import { GameView } from "../views/Game.js";
import { GameSetupView } from "../views/GameSetup.js";
import { LoginView } from "../views/Login.js";
// import { OnlineGameView } from "../views/Online.js";
import { OnlineGameLoadingView } from "../views/OnlineLoading.js";
import { ProfileView } from "../views/Profile.js";
import { RegisterView } from "../views/Register.js";
import { LocalGameOverview } from "../views/LocalGameOverview.js";
import { TwoFactorView } from "../views/TwoFactor.js";

export const urlRoutes = {
	"/": {
		template: "../templates/login.html",
		title: "Login",
		view: LoginView,
	},
	"/two-factor": {
		template: "../templates/two-factor.html",
		title: "Two Factor Authentication",
		view: TwoFactorView,
	},
	"/register": {
		template: "../templates/register.html",
		title: "Register",
		view: RegisterView,
	},
	"/game-setup": {
		template: "../templates/game-setup.html",
		title: "Setup",
		view: GameSetupView,
	},
	"/game": {
		template: "../templates/game.html",
		title: "Game",
		view: GameView,
	},
	"/profile": {
		template: "../templates/profile.html",
		title: "Profile",
		view: ProfileView,
	},
	"/online-game": {
		template: "../templates/game.html",
		title: "Game",
		view: GameView,
	},
	"/online-game-loading": {
		template: "../templates/online-game-loading.html",
		title: "Loading",
		view: OnlineGameLoadingView,
	},
	"/local-game-overview": {
		template: "../templates/local-game-overview.html",
		title: "Overview",
		view: LocalGameOverview,
	}
};