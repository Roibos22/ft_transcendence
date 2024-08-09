document.addEventListener('DOMContentLoaded', () => {
	const gameSetup = document.getElementById('gameSetup');
	const playerForm = document.getElementById('playerForm');
	const canvas = document.getElementById('gameCanvas');

	playerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		let player1 = document.getElementById('player1').value.trim();
		if (!player1) player1 = "Player 1";
		let player2 = document.getElementById('player2').value.trim();
		if (!player2) player2 = "Player 2";

		gameSetup.style.display = 'none';
		canvas.style.display = 'block';			
		console.log(`Game started with ${player1} and ${player2}`);
	});
});