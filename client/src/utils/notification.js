export function showErrorNotification(messages) {
	const notification = document.getElementById('notification');
	const notificationMessage = document.getElementById('notification-message');
	
	const messageArray = Array.isArray(messages) ? messages : [messages];
	notificationMessage.innerHTML = messageArray.join('<br>');
	
	notification.classList.add('show');
	notification.classList.add('error');
	
	setTimeout(() => {
		notification.classList.remove('show');
	}, 5000);
}

export function showNotification(messages) {
	const notification = document.getElementById('notification');
	const notificationMessage = document.getElementById('notification-message');
	
	const messageArray = Array.isArray(messages) ? messages : [messages];
	notificationMessage.innerHTML = messageArray.join('<br>');
	
	notification.classList.add('show');
	notification.classList.remove('error');
	
	setTimeout(() => {
		notification.classList.remove('show');
	}, 5000);
}