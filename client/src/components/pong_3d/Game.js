import { AudioManager } from "./AudioManager.js";
import { Sprite } from "./Sprite.js";
import { Triangle } from "./Triangle.js";
import * as THREE from 'three';

export class Game {
    constructor() {
        this.scene = this.createScene();
        this.camera = this.getCamera();
        this.renderer = this.setupRenderer()
        this.clock = new THREE.Clock();
        this.audioListener = new THREE.AudioListener();

        this.setupCanvas();

        this.gameElements = this.getGameElements();
        this.animationMixers = this.getMixers();

        this.audio = new AudioManager(this.audioListener);

        this.addSprites();
    }

    createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xC3E5D4);
        return scene;
    }

    getCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 700; 
        
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, // left
            frustumSize * aspect / 2,  // right
            frustumSize / 2,           // top
            frustumSize / -2,          // bottom
            -10000,                    // near
            10000                      // far
        );
        
        camera.position.set(10, 10, 10); 
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    getFloor() {
        const floorGeometry = new THREE.PlaneGeometry(500, 1000, 10, 10);
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x33CB99, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.receiveShadow = true;
        return floor;
    }

    setupCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
    }
    
    setupRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl') });
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }
    
    addSprites() {
        this.scene.add(this.gameElements.floor);
        this.scene.add(new Triangle(1).shape);
        this.scene.add(new Triangle(2).shape);
    }

    getGameElements() {
        return {
            elephant: new Sprite({
                path: "src/public/spriteModels/elephant/scene.gltf",
                scene: this.scene,
                position: { x: 0, y: 0, z: 0 },
                scale: { x: 0.3, y: 0.3, z: 0.3 },
                currentAnimation: 5,
                player: -1,
            }),
            player1: new Sprite({
                path: "src/public/spriteModels/mouse/scene.gltf",
                scene: this.scene,
                position: { x: 0, y: 0, z: -490 },
                scale: { x: 0.2, y: 0.2, z: 0.2 },
                currentAnimation: 0,
                player: 1,
            }),
            player2: new Sprite({
                path: "src/public/spriteModels/mouse/scene.gltf",
                scene: this.scene,
                position: { x: 0, y: 0, z: 490 },
                scale: { x: 0.2, y: 0.2, z: 0.2 },
                currentAnimation: 0,
                player: 2,
            }),
            floor: this.getFloor(),
        };
    }

    getMixers() {
        return {
            elephant: this.gameElements.elephant.mixer,
            player1: this.gameElements.player1.mixer,
            player2: this.gameElements.player2.mixer,
        };
    }
}