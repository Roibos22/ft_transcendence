export default class OnlineInputHandler {
    constructor(socket) {
        this.socket = socket;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener('keydown', (e) => this.preventDefaultScroll(e));
    }

    preventDefaultScroll(e) {
        if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
            e.preventDefault();
        }
    }

    handleKeyDown(e) {
        console.log(this.socket);
        switch(e.key) {
            case 'ArrowUp':
                this.socket.send(JSON.stringify({ action: 'move_player', direction: '1' }));
                break;
            case 'ArrowDown':
                this.socket.send(JSON.stringify({ action: 'move_player', direction: '-1' }));
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.socket.send(JSON.stringify({
                    action: 'move_player',
                    direction: '0' }));
                break;
        }
    }
}