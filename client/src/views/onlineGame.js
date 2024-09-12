import { loadTemplate } from '../router.js';
import { PongGame } from './../conponents_online/PongGame.js';
import * as Cookies from '../services/cookies.js';

export async function initGameOnlineView() {
	const content = await loadTemplate('online-game');
	document.getElementById('app').innerHTML = content;
	const game = new PongGame();

	const authToken = Cookies.getCookie("accessToken");
	console.log('Auth Token:', authToken);

	
	const socketWithUrlToken = connectWebSocketWithUrlToken();
	const socketWithMessageToken = connectWebSocketWithMessageToken();
}

function connectWebSocketWithUrlToken() {
	const authToken = Cookies.getCookie("accessToken");

	// Pass the token in the URL
	const socket = new WebSocket(`ws://localhost:8000/ws/matchmaking/?Authorization=Bearer ${authToken}`);

	socket.addEventListener('open', (event) => {
		console.log('WebSocket connection opened (URL Token Method)');
	});

	socket.addEventListener('message', (event) => {
		console.log('Message from server:', event.data);
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {
			console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
		} else {
			console.error('Connection died');
		}
	});

	socket.addEventListener('error', (error) => {
		console.error('WebSocket error (URL Token Method):', error);
	});

	return socket;
}

function connectWebSocketWithMessageToken() {
	const authToken = Cookies.getCookie("accessToken");
	const socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');

	socket.addEventListener('open', (event) => {
		console.log('WebSocket connection opened (Message Token Method)');

		socket.send(JSON.stringify({
			type: 'Authorization',
			token: `Bearer ${authToken}`
		}));
	});

	socket.addEventListener('message', (event) => {
		console.log('Message from server:', event.data);
	});

	socket.addEventListener('close', (event) => {
		if (event.wasClean) {
			console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
		} else {
			console.error('Connection died');
		}
	});

	socket.addEventListener('error', (error) => {
		console.error('WebSocket error (Message Token Method):', error);
	});

	return socket;
}
