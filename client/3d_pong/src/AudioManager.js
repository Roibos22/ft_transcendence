import * as THREE from "three";

export class AudioManager {
	constructor(listener) {
		this.isMuted = true;
		this.loader = new THREE.AudioLoader();
		this.backgroundMusic = new THREE.Audio(listener);
		this.setupBackgroundMusic();
		this.soundFX = {
			elephantNoise: new THREE.Audio(listener),
			mouseNoise: new THREE.Audio(listener),
		};
		this.setupSoundFX();
	}

	setupBackgroundMusic() {
		this.loader.load("music/cute-creatures-150622.mp3", (buffer) => {
			this.backgroundMusic.setBuffer(buffer);
			this.backgroundMusic.setLoop(true);
			this.backgroundMusic.setVolume(0);
			this.backgroundMusic.play();
		});
	}

	setupSoundFX() {
		this.loader.load("music/elephantSound.flac", (buffer) => {
			this.soundFX.elephantNoise.setBuffer(buffer);
			this.soundFX.elephantNoise.setLoop(false);
			this.soundFX.elephantNoise.setVolume(0.5);
		});

		this.loader.load("music/mouseSqueak.mp3", (buffer) => {
			this.soundFX.mouseNoise.setBuffer(buffer);
			this.soundFX.mouseNoise.setLoop(false);
			this.soundFX.mouseNoise.setVolume(0.5);
		});
	}
}
