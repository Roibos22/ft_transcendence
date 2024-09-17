import { GameView } from "../views/Game.js";
import { GameSetupView } from "../views/GameSetup.js";
import { LoginView } from "../views/Login.js";
// import { OnlineGameView } from "../views/OnlineGame.js";
import { ProfileView } from "../views/Profile.js";
import { RegisterView } from "../views/Register.js";


export const urlRoutes = {
	"/": {
		template: "../templates/login.html",
		title: "Login",
		view: LoginView,
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
		template: "../templates/online-game.html",
		title: "Game",
		// view: OnlineGameView,
	}
};