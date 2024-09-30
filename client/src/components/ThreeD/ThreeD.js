import * as THREE from 'three';
import { Sprite } from './Sprite.js';
import State from '../../State.js';

export default class ThreeD {
    constructor(game) {
        this.canvas = null
        this.game = game

        this.scene = null
        this.camera = null
        this.renderer = null

        this.clock = null
        this.audioListener = null

        this.elephant = null;

        this.mice = {
            player1: null,
            player2: null
        }

        this.spritesLoaded = false;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupCamera();
        this.addFloor();
        this.loadSprites();
        this.setupRenderer();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas3D');
        this.canvas.width = 1000;
        this.canvas.height = 500;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xC3E5D4);
    }

    setupCamera() {
        const aspect = this.canvas.width / this.canvas.height;
        const frustumSize = 700;

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, // left
            frustumSize * aspect / 2,  // right
            frustumSize / 2,           // top
            frustumSize / -2,          // bottom
            -10000,                    // near
            10000                      // far
        );

        this.camera.position.set(250, 250, -250);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    }

    addFloor() {
        const floorGeometry = new THREE.PlaneGeometry(this.game.field.width, this.game.field.height);
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x33CB99, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        floor.rotation.x = Math.PI / 2;
        this.scene.add(floor);
        console.log(floor.position);
    }

    newMouse() {
        return new Sprite({
            path: "../public/mouse/scene.gltf",
            scene: this.scene,
            scale: { x: 0.2, y: 0.2, z: 0.2 },
            currentAnimation: 0
        });
    }

    loadSprites() {
        this.elephant = new Sprite({
            path: "../public/elephant/scene.gltf",
            scene: this.scene,
            scale: { x: 0.3, y: 0.3, z: 0.3 },
            currentAnimation: 0
        });
        this.mice.player1 = this.newMouse();
        this.mice.player2 = this.newMouse();
        
        const interval = setInterval(() => {
            if (this.elephant.loadedFlag && this.mice.player1.loadedFlag && this.mice.player2.loadedFlag) {
                this.spritesLoaded = true;
                this.setupMice();
                clearInterval(interval);
            }
        }, 100);
    }

    setupMice() {
        this.elephant.model.position.set(500, 0, 250);
        this.mice.player1.model.position.set(500, 0, 0);
        this.mice.player1.model.rotation.y = -Math.PI/2;
        this.mice.player2.model.position.set(-500, 0, 0);
        this.mice.player2.model.rotation.y = Math.PI/2;
    }

    update() {
        if (!this.spritesLoaded) return;

        const ball = State.get('gameData', 'ball');
        this.elephant.model.position.set((ball.x - 500) * -1, 0, (ball.y - 250) * -1);

        const player1Pos = State.get('gameData', 'player1Pos');
        this.mice.player1.model.position.set(500, 0, (player1Pos - 250) * -1);

        const player2Pos = State.get('gameData', 'player2Pos');
        this.mice.player2.model.position.set(-500, 0, (player1Pos - 250) * -1);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    show() {
        this.canvas.style.display = 'inline';
    }

    hide() {
        this.canvas.style.display = 'none';
    }
}