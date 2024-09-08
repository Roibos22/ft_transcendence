import { AudioManager } from "./AudioManager";
import { Elephant } from "./Elephant";
import { Mouse } from "./Mouse";
import * as THREE from 'three';

export class Game {
    constructor() {
        this.audioListener = new THREE.AudioListener();
        this.camera = this.getCamera();
        this.renderer = this.setupRenderer()
        this.clock = new THREE.Clock();
        
        this.setupScene();

        this.elephant = new Elephant(this.scene);
        this.player1 = new Mouse(this.scene, 1);
        this.player2 = new Mouse(this.scene, 2);

        this.animationMixers = [
            this.elephant.animationMixer,
            this.player1.animationMixer,
            this.player2.animationMixer
        ];

        this.floor = this.getFloor();

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
        const frustumSize = 600; 
        
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

    setupScene() {
        this.scene = this.createScene();
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
        this.scene.add(this.floor);
        this.scene.add(this.player1.hitTriangle.shape);
        this.scene.add(this.player2.hitTriangle.shape);
    }
}