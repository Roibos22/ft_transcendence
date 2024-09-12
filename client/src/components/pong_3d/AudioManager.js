import * as THREE from "three";

export class AudioManager {
	isMuted = true;

	constructor(listener) {
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
		this.loader.load("src/public/music/cute-creatures-150622.mp3", (buffer) => {
			this.backgroundMusic.setBuffer(buffer);
			this.backgroundMusic.setLoop(true);
			this.backgroundMusic.setVolume(0);
			this.backgroundMusic.play();
		});
	}

	setupSoundFX() {
		this.loader.load("src/public/music/elephantSound.flac", (buffer) => {
			this.soundFX.elephantNoise.setBuffer(buffer);
			this.soundFX.elephantNoise.setLoop(false);
			this.soundFX.elephantNoise.setVolume(0.5);
		});

		this.loader.load("src/public/music/mouseSqueak.mp3", (buffer) => {
			this.soundFX.mouseNoise.setBuffer(buffer);
			this.soundFX.mouseNoise.setLoop(false);
			this.soundFX.mouseNoise.setVolume(0.5);
		});
	}
}
