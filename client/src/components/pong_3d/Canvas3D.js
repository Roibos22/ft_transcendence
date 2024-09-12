import { Game } from "./Game.js";

export class Canvas3D {
	constructor() {
		this.game = new Game();

        this.title = this.getTitle();
		this.scoreDisplays = this.getScoreDisplays();
		this.buttons = this.getButtons();

		this.showUIElements();
	}

    getTitle() {
        const title = document.createElement("div");
        title.style.position = "absolute";
        title.style.color = "#33CB99";

        // use unicode symbol for up and down arrow and have space between the arrows
        title.innerHTML = `<div class="title">elepong<div>
        <div class="subtitle">a game by joseph, dilshod, leon, barra and louis</div>
        <div class="controls">player 1: W, S</div>
        <div class="controls">player 2: ▲, ▼</div>
        `;

        title.style.top = "0px";
        title.style.left = "20px";
        return title;
    }


	getScoreDisplays() {
		const player1Score = document.createElement("div");

		player1Score.style.position = "absolute";
		player1Score.style.color = "white";
		player1Score.innerHTML =
			`<div class="score-card">
                <div class="score-label">Player 1</div>
                <div id="scoreValue" class="score">0</div>
            </div>`;

		player1Score.style.bottom = "20px";
		player1Score.style.left = "40px";

        const player2Score = document.createElement("div");
        player2Score.style.position = "absolute";
        player2Score.style.color = "white";

        player2Score.innerHTML =
            `<div class="score-card">
                <div class="score-label">Player 2</div>
                <div id="player2ScoreValue" class="score">0</div>
            </div>`;

        player2Score.style.top = "20px";
        player2Score.style.right = "40px";

		return {player1Score, player2Score};
	}

	getButtons() {
		return {
			mute: this.getMuteButton(),
			elephantNoise: this.getElephantSoundButton(),
			mouseSqueak: this.getMouseSqueakButton(),
		};
	}

	getMuteButton() {
		const muteButton = document.createElement("button");
		muteButton.innerHTML = "Unmute";
		muteButton.style.position = "absolute";
		muteButton.style.bottom = "10px";
		muteButton.style.right = "10px";
		muteButton.style.zIndex = "100";
		muteButton.onclick = () => {
			muteButton.innerHTML = this.game.audio.isMuted ? "Unmute" : "Mute";
			this.game.audio.backgroundMusic.setVolume(
				this.game.audio.isMuted ? 0 : 1
			);
			this.game.audio.isMuted = !this.game.audio.isMuted;
		};
		return muteButton;
	}

	getElephantSoundButton() {
		const elephantSoundButton = document.createElement("button");
		elephantSoundButton.innerHTML = "Play Elephant Sound";
		elephantSoundButton.style.position = "absolute";
		elephantSoundButton.style.bottom = "50px";
		elephantSoundButton.style.right = "10px";
		elephantSoundButton.onclick = () => {
			this.game.audio.soundFX.elephantNoise.play();

			this.game.gameElements.elephant.mixer.stopAllAction();
			const action = this.game.gameElements.elephant.mixer.clipAction(
				this.game.gameElements.elephant.animations[6]
			);
			action.play();
			setTimeout(() => {
				action.stop();
				const action2 =
					this.game.gameElements.elephant.mixer.clipAction(
						this.game.gameElements.elephant.animations[5]
					);
				action2.play();
				this.game.gameElements.elephant.model.rotation.y += Math.PI;
			}, 1500);
		};
		return elephantSoundButton;
	}

	getMouseSqueakButton() {
		const mouseSqueakButton = document.createElement("button");
		mouseSqueakButton.innerHTML = "Play Mouse Squeak";
		mouseSqueakButton.style.position = "absolute";
		mouseSqueakButton.style.bottom = "90px";
		mouseSqueakButton.style.right = "10px";
		mouseSqueakButton.onclick = () => {
			this.game.audio.soundFX.mouseNoise.play();
		};
		return mouseSqueakButton;
	}

	showUIElements() {
		const elements = [
            this.title,
			this.game.renderer.domElement,
			...Object.values(this.scoreDisplays),
			...Object.values(this.buttons),
		];

		elements.forEach((element) => {
			document.body.appendChild(element);
		});
		console.log(document)
	}
}
