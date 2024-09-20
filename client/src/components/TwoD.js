export default class TwoD {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = null;

        this.init();
    }

    init() {
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = 800;
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, 1000, 500);
    }
}