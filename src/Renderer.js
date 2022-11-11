const CanvasBuilder = require('./canvasBuilder');
const { promises } = require('fs');
const Graph = require('./Graph');

module.exports = class Renderer {
    constructor(graphs, w, h, minX, maxX, minY, maxY) {
        // Graphs example:
        // graphs = [
        //      { formula: '2x+3', minX: -100, maxX: 100 },
        //      { formula: 'sin(x)', minX: -100, maxX: 100 }
        // ]
        this.graphData = graphs;
        this.w = w;
        this.h = h;
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;

        this.graphs = [];

        for (const graph of this.graphData) {
            this.graphs.push(new Graph(graph.formula, this.minX, this.maxX, this.minY, this.maxY, graph.res, this.w, this.h, graph.minX, graph.maxX, graph.color));
        }

    }
    createCanvas(w, h) {
        this.w = w;
        this.h = h;
        this.canvas = new CanvasBuilder(this.w, this.h);

        this.canvas.ctx.fillStyle = 'white';
        this.canvas.ctx.fillRect(0, 0, this.canvas.w, this.canvas.h)
    }
    line(ctx, p1, p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    drawGrid(graph, ctx) {
        //Horizontal lines
        for (let y = -graph.recalculatePoint({ x: 0, y: 0 }).y; y < graph.undoCalculate({ x: 0, y: this.h }).y; y++) {
            if (y % 10 == 0) {
                if (y == 0) { ctx.lineWidth = 2; }
                else { ctx.lineWidth = 1; }
                let p1 = graph.recalculatePoint({ x: graph.minX, y: y });
                p1.x = 0;
                let p2 = graph.recalculatePoint({ x: graph.maxX, y: y });
                p2.x = this.w;
                this.line(ctx, p1, p2);
            }
        }

        // Vertical lines
        for (let x = -graph.recalculatePoint({ x: 0, y: 0 }).x; x < graph.undoCalculate({ x: this.w, y: 0 }).x; x++) {
            if (x % 10 == 0) {
                if (x == 0) { ctx.lineWidth = 2; }
                else { ctx.lineWidth = 1; }
                let p1 = graph.recalculatePoint({ x: x, y: graph.minY });
                p1.y = 0;
                let p2 = graph.recalculatePoint({ x: x, y: graph.maxY });
                p2.y = this.h;
                this.line(ctx, p1, p2);
            }
        }
    }
    drawGraph(graph) {
        for (let point of graph.points) {
            point = graph.recalculatePoint(point);
        }

        for (const point of graph.points) {
            let i = graph.points.indexOf(point);
            if (i < graph.points.length-1) {
                let otherPoint = graph.points[i+1];
                this.canvas.ctx.strokeStyle = '#333';
                this.canvas.ctx.lineWidth = 3;
                this.line(this.canvas.ctx, point, otherPoint);
                this.canvas.ctx.strokeStyle = graph.color;
                this.canvas.ctx.lineWidth = 2;
                this.line(this.canvas.ctx, point, otherPoint);
            }
        }
    }
    async generateImage(type, loc) {

        this.createCanvas(1000, 1000);
        this.drawGrid(this.graphs[0], this.canvas.ctx)

        for (const graph of this.graphs) {
            this.drawGraph(graph);
        }

        const pngData = await this.canvas.canvas.encode(type);

        await promises.writeFile(`${loc}.${type}`, pngData);
        console.log("Done. Check graph.png")
    }
}