import { loadTemplate } from '../router.js';
import { PongGame } from '../conponents_online/PongGame.js';
import * as Cookies from '../services/cookies.js';

export class OnlineGameView {
	constructor() {
		this.game = null;
	}

	async init() {
		const content = await loadTemplate('online-game');
		document.getElementById('app').innerHTML = content;
		this.game = new PongGame();
	}
}

export async function initGameOnlineView() {
	const content = await loadTemplate('online-game');
	document.getElementById('app').innerHTML = content;
	const game = new PongGame();
	const authToken = Cookies.getCookie("accessToken");
	console.log(authToken);

	//const socket = connectWebSocket();
	//const socket1 = connectWebSocketWithUrlToken();
	//const socket2 = connectWebSocketWithHeaderToken();
	const socket3 = connectWebSocketWithMessageToken();
	//const socket4 = connectWebSocketWithHeaderTokenHTTP();
}

function connectWebSocket() {
	const authToken = Cookies.getCookie("accessToken");
	const wsUrl = 'ws://localhost:8000/ws/matchmaking/';

	try {
	  // Create a WebSocket connection with custom headers ->>> INVALID PROTOCOL
	  const socket = new WebSocket(wsUrl, {
		headers: {
		  'Authorization': `Bearer ${authToken}`
		}
	  });

	  socket.addEventListener('open', (event) => {
		console.log('WebSocket connection opened');
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
		console.error('WebSocket error:', error);
	  });

	  return socket;
	} catch (error) {
	  console.error('Error establishing WebSocket connection:', error);
	  return null;
	}
  }

function connectWebSocketWithUrlToken() {
	const authToken = Cookies.getCookie("accessToken");

	// Pass the token in the URL
	const socket = new WebSocket(`ws://localhost:8000/ws/matchmaking/?Authorization=Bearer${authToken}`);

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

async function connectWebSocketWithHeaderToken() {
	const authToken = Cookies.getCookie("accessToken");
	const wsUrl = 'ws://localhost:8000/ws/matchmaking/';

	try {
	  // Create a WebSocket connection
	  const socket = new WebSocket(wsUrl);

	  // Set up event listeners
	  socket.addEventListener('open', (event) => {
		console.log('WebSocket connection opened');
		// Send the authentication token immediately after connection is established
		socket.send(JSON.stringify({ token: authToken }));
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
		console.error('WebSocket error:', error);
	  });

	  return socket;
	} catch (error) {
	  console.error('Error establishing WebSocket connection:', error);
	  return null;
	}
}

function connectWebSocketWithMessageToken() {
	const authToken = Cookies.getCookie("accessToken");
	const socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');

	socket.addEventListener('open', (event) => {
		console.log('WebSocket connection opened (Message Token Method)');

		socket.send(JSON.stringify({
            action: 'join_game',
			token: `${authToken}`
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

async function connectWebSocketWithHeaderTokenHTTP() {
	const authToken = Cookies.getCookie("accessToken");
	const wsUrl = 'ws://localhost:8000/ws/matchmaking/';
	const httpUrl = 'http://localhost:8000/ws/matchmaking/';

	try {
	  // Initiate the connection with a fetch request
	  const response = await fetch(httpUrl, {
		method: 'GET',
		headers: {
		  'Authorization': `Bearer ${authToken}`,
		  'Upgrade': 'websocket',
		  'Connection': 'Upgrade'
		}
	  });

	  if (response.ok) {
		// If the server accepts the connection, create a WebSocket
		const socket = new WebSocket(wsUrl);

		socket.addEventListener('open', (event) => {
		  console.log('WebSocket connection opened (Header Token Method)');
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
		  console.error('WebSocket error (Header Token Method):', error);
		});

		return socket;
	  } else {
		throw new Error('Failed to establish WebSocket connection');
	  }
	} catch (error) {
	  console.error('Error establishing WebSocket connection:', error);
	  return null;
	}
  }
