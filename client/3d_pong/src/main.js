import Window from './Window';

const _window = new Window();

function animate() {
    requestAnimationFrame(animate);

    const delta = _window.game.clock.getDelta();
    if (_window.game.elephant.mixer) _window.game.elephant.mixer.update(delta);
    if (_window.game.player1.mixer) _window.game.player1.mixer.update(delta);
    if (_window.game.player2.mixer) _window.game.player2.mixer.update(delta);

    _window.game.renderer.render(_window.game.scene, _window.game.camera);
}

animate();

window.addEventListener('resize', () => {
  _window.game.camera.aspect = window.innerWidth / window.innerHeight;
  _window.game.camera.updateProjectionMatrix();
  _window.game.renderer.setSize(window.innerWidth, window.innerHeight);
});
