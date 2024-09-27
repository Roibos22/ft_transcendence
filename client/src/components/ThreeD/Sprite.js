import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class Sprite {
	constructor({ path, scene, scale, currentAnimation}) {
		this.modelPath = path;
		this.scene = scene;
		this.model = null;
		this.mixer = null;
		this.animations = null;
		this.position = { x: 0, y: 0, z: 0 };
		this.scale = scale || { x: 1, y: 1, z: 1 };
		this.currentAnimation = currentAnimation;
        this.loadedFlag = false;

		this.loadModel();
	}

	loadModel() {
		const modelLoader = new GLTFLoader();
		modelLoader.load(this.modelPath, (gltf) => {
			this.model = gltf.scene;
			this.mixer = new THREE.AnimationMixer(this.model);
			this.animations = gltf.animations;
			this.model.position.set(
				this.position.x,
				this.position.y,
				this.position.z
			);
			this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
			this.scene.add(this.model);

			if (this.animations && this.animations.length) {
				const action = this.mixer.clipAction(
					this.animations[this.currentAnimation]
				);
				action.play();
			}
			
			this.loadedFlag = true;
		});
	}

    rotateModel() {
        this.model.rotation.y = this.model.rotation.y === 0 ? Math.PI : 0;
    }
}
