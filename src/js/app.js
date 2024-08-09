document.addEventListener('DOMContentLoaded', () => {
	const gameSetup = document.getElementById('gameSetup');
	const playerForm = document.getElementById('playerForm');
	const canvas = document.getElementById('gameCanvas');

	playerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const player1 = document.getElementById('player1').value;
		const player2 = document.getElementById('player2').value;

		if (player1 && player2) {
			gameSetup.style.display = 'none';
			canvas.style.display = 'block';			
			console.log(`Game started with ${player1} and ${player2}`);
		}
	});
});