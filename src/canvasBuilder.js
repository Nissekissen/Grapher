const Canvas = require('@napi-rs/canvas');

class CanvasBuilder {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.canvas = Canvas.createCanvas(w, h);
        this.ctx = this.canvas.getContext('2d');
    }
}

module.exports = CanvasBuilder;