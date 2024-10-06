import * as THREE from 'three';
import { Sprite } from './Sprite.js';
import State from '../../State.js';

export default class ThreeD {
    constructor(game) {
        this.canvas = null;
        this.game = game;

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.clock = new THREE.Clock();
        this.audioListener = null;

        this.elephant = null;

        this.mice = {
            player1: null,
            player2: null
        }

        this.hitBoxes = {
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
        this.setupHitBoxes();
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
            currentAnimation: 5
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

    newHitBox() {
        const hitBoxGeometry = new THREE.PlaneGeometry(5, 20);
        const hitBoxMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            // transparent: true,
            // opacity: 0.5
        });
        const hitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
        hitBox.rotation.x = Math.PI / 2;
        return hitBox;
    }

    setupHitBoxes() {
        this.hitBoxes.player1 = this.newHitBox();
        this.hitBoxes.player1.position.set(500, 1, 0);

        this.hitBoxes.player2 = this.newHitBox();
        this.hitBoxes.player2.position.set(-500, 1, 0);

        this.scene.add(this.hitBoxes.player1);
        this.scene.add(this.hitBoxes.player2);
    }

    calculateElephantDirection(ball) {
        const angle = Math.atan2(ball.dx, ball.dy);
        this.elephant.model.rotation.y = angle + Math.PI;
    }

    update() {
        if (!this.spritesLoaded) return;

        const { ball, player1Pos, player2Pos} = State.get('gameData');

        this.calculateElephantDirection(ball);
        this.elephant.model.position.set((ball.x - 500) * -1, 0, (ball.y - 250) * -1);
        this.mice.player1.model.position.set(500, 0, (player1Pos - 250) * -1);
        this.hitBoxes.player1.position.set(495, 1, (player1Pos - 250) * -1);
        this.mice.player2.model.position.set(-500, 0, (player2Pos - 250) * -1);
        this.hitBoxes.player2.position.set(-494, 1, (player2Pos - 250) * -1);
    }

    changePlayerDirection(player, direction) {
        const mouse = this.mice[`player${player}`];
        mouse.model.rotation.y = player === 1
                                ? -Math.PI/2 + direction * -Math.PI/2
                                : Math.PI/2 + direction * Math.PI/2;

        const newAnimation = direction === 0 ? 0 : 7;
        if (newAnimation === mouse.currentAnimation) return;

        mouse.currentAnimation = newAnimation;
    
        const action = mouse.mixer.clipAction(mouse.animations[newAnimation]);
        mouse.mixer.stopAllAction();
        action.play();
    }

    getAnimationMixers() {
        return [
            this.elephant.mixer,
            this.mice.player1.mixer,
            this.mice.player2.mixer
        ];
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        const mixers = this.getAnimationMixers();
        const delta = this.clock.getDelta();
        if (this.spritesLoaded && mixers) {
            mixers.forEach(mixer => mixer.update(delta));
        }
        this.renderer.render(this.scene, this.camera);
    }

    show() {
        this.canvas.style.display = 'inline';
    }

    hide() {
        this.canvas.style.display = 'none';
    }
}