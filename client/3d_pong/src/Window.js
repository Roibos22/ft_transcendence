import { Game } from "./Game";

export default class Window {
    constructor() {
        this.game = new Game();

        this.muteButton = this.getMuteButton()
        this.getYourScore();

        this.getElephantSoundButton();
        this.getMouseSqueakButton();

        document.body.appendChild(this.game.renderer.domElement);
    }

    getMuteButton() {
        const muteButton = document.createElement('button');
        muteButton.innerHTML = 'Unmute';
        muteButton.style.position = 'absolute';
        muteButton.style.top = '10px';
        muteButton.style.right = '10px';
        muteButton.style.zIndex = '100';
        muteButton.onclick = () => {
            muteButton.innerHTML = this.game.audio.isMuted ? 'Unmute' : 'Mute';
            this.game.audio.backgroundMusic.setVolume(this.game.audio.isMuted ? 0 : 1);
            this.game.audio.isMuted = !this.game.audio.isMuted;
        }
        document.body.appendChild(muteButton);
    }

    getYourScore() {
        const yourScore = document.createElement('div');
        yourScore.style.position = 'absolute';
        yourScore.style.color = 'white';
        yourScore.innerHTML = '<div class="score-card"><div class="score-label">Your Score</div><div id="scoreValue" class="score">0</div><br/><br/><br/><br/><div class="score-label">Opponent Score</div><div id="opponentScoreValue" class="score">0</div>';
        yourScore.style.top = '10px';
        yourScore.style.left = '10px';
        document.body.appendChild(yourScore);
    }

    getElephantSoundButton() {
        const elephantSoundButton = document.createElement('button');
        elephantSoundButton.innerHTML = 'Play Elephant Sound';
        elephantSoundButton.style.position = 'absolute';
        elephantSoundButton.style.bottom = '10px';
        elephantSoundButton.style.left = '10px';
        elephantSoundButton.onclick = () => {
            this.game.audio.soundFX.elephantNoise.play();

            this.game.elephant.mixer.stopAllAction();
            const action = this.game.elephant.mixer.clipAction(this.game.elephant.animations[6]);
            action.play();
            setTimeout(() => {
                action.stop();
                const action2 = this.game.elephant.mixer.clipAction(this.game.elephant.animations[5]);
                action2.play();
                this.game.elephant.model.rotation.y += Math.PI/2;
            }, 1500);
        }
        document.body.appendChild(elephantSoundButton);
    }

    getMouseSqueakButton() {
        const mouseSqueakButton = document.createElement('button');
        mouseSqueakButton.innerHTML = 'Play Mouse Squeak';
        mouseSqueakButton.style.position = 'absolute';
        mouseSqueakButton.style.bottom = '10px';
        mouseSqueakButton.style.right = '10px';
        mouseSqueakButton.onclick = () => {
            this.game.audio.soundFX.mouseNoise.play();
        }
        document.body.appendChild(mouseSqueakButton);
    }
}