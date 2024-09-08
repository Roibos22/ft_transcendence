import { Triangle } from "./Triangle";
import { Sprite } from "./Sprite";

export class Mouse extends Sprite {
    constructor(scene, player) {
        super({
            path: 'mouse/scene.gltf',
            scene,
            position: { x:0, y:0, z:player === 1 ? -490 : 490 },
            scale: { x:0.2, y:0.2, z:0.2 },
            currentAnimation: 0,
            player,
        });

        this.hitTriangle = new Triangle(player);
    }
}