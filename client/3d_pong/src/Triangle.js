import * as THREE from 'three';

export class Triangle {
    constructor(player) {
        this.geometry = new THREE.BufferGeometry();
        this.vertices = new Float32Array([
            0.0, .5, 0.0,  // Vertex 1
            -1.0, -1.0, 0.0, // Vertex 2
            1.0, -1.0, 0.0   // Vertex 3
        ]);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
        this.material = new THREE.MeshBasicMaterial({ color: 0xC3E5D4, side: THREE.DoubleSide });
        this.shape = new THREE.Mesh(this.geometry, this.material);

        this.shape.position.x = 0;
        this.shape.position.y = 2;
        this.shape.scale.set(50, 50, 50);
        this.shape.rotation.x = Math.PI / 2;

        this.shape.position.z = player === 1 ? -480 : 480;
        this.shape.rotation.z = player === 1 ? Math.PI : 0;
    }
}