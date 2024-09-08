import { Canvas3D } from './Canvas3D';

const canvas = new Canvas3D();

function animate() {
    requestAnimationFrame(animate);

    const delta = canvas.game.clock.getDelta();
    if (canvas.game.gameElements.elephant.mixer) canvas.game.gameElements.elephant.mixer.update(delta);
    if (canvas.game.gameElements.player1.mixer) canvas.game.gameElements.player1.mixer.update(delta);
    if (canvas.game.gameElements.player2.mixer) canvas.game.gameElements.player2.mixer.update(delta);

    canvas.game.renderer.render(canvas.game.scene, canvas.game.camera);
}

animate();

window.addEventListener('resize', () => {
  canvas.game.camera.aspect = window.innerWidth / window.innerHeight;
  canvas.game.camera.updateProjectionMatrix();
  canvas.game.renderer.setSize(window.innerWidth, window.innerHeight);
});
