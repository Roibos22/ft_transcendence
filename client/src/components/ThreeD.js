import * as THREE from 'three';

export default class ThreeD {
    constructor(game) {
        this.canvas = null
        this.game = game

        this.scene = null
        this.camera = null
        this.renderer = null

        this.clock = null
        this.audioListener = null

        this.setupCanvas();
        this.setupCamera();
        this.addFloor();
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
        
        this.camera.position.set(10, 10, 10); 
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    }

    addFloor() {
        const floorGeometry = new THREE.PlaneGeometry(this.game.field.width, this.game.field.height, 10, 10);
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x33CB99, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.rotation.z = Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    show() {
        this.canvas.style.display = 'inline';
    }

    hide() {
        this.canvas.style.display = 'none';
    }
}