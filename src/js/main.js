document.addEventListener('DOMContentLoaded', () => {
	const game = new Game();
	game.init();
});

document.getElementById('addPlayer').addEventListener('click', function() {
	const playerInputs = document.getElementById('playerInputs');
	const playerCount = playerInputs.children.length + 1;
	const newPlayerDiv = document.createElement('div');
	newPlayerDiv.innerHTML = `<input type="text" id="player${playerCount}" placeholder="Player ${playerCount}">`;
	playerInputs.appendChild(newPlayerDiv);
});