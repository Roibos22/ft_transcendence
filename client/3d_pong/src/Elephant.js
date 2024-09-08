import { Sprite } from './Sprite.js';

export class Elephant extends Sprite {
  constructor(scene) {
    super({
      path: 'elephant/scene.gltf',
      scene,
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      currentAnimation: 5,
      player: -1,
    }
    );
  }
}