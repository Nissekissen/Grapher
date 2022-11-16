const CanvasBuilder = require('./canvasBuilder');
const { promises, fstat } = require('fs');
const Graph = require('./Graph');
const path = require('path');
const fs = require('fs');
const { abs } = require('mathjs');

/** @class Renderer */
module.exports = class Renderer {
    /**
     * Creates an instance of a renderer
     * 
     * @author Nissekissen
     * 
     * @param {Array.<{formula: String, minX: Number, maxX: Number, color: String, res: Number}>} graphs 
     * @param {Number} w Image width (px)
     * @param {Number} h Image height (px)
     * @param {Number} minX Smallest x value visible
     * @param {Number} maxX Biggest x value visible
     * @param {Number} minY Smallest y value visible
     * @param {Number} maxY Biggest y value visible
     */
    constructor(graphs, w, h, minX, maxX, minY, maxY) {
        // Graphs example:
        // graphs = [
        //      { formula: '2x+3', minX: -100, maxX: 100, color: 'red', res: 0.1 },
        //      { formula: 'sin(x)', minX: -100, maxX: 100, color: 'green', res: o.1 }
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
    /**
     * Creates a canvas and fills it with a background color
     * 
     * @param {Number} w 
     * @param {Number} h 
     */
    createCanvas(w, h) {
        this.w = w;
        this.h = h;
        this.canvas = new CanvasBuilder(this.w, this.h);

        this.canvas.ctx.fillStyle = 'white';
        this.canvas.ctx.fillRect(0, 0, this.canvas.w, this.canvas.h)
    } 
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{x: Number, y: Number}} p1 
     * @param {{x: Number, y: Number}} p2 
     */
    line(ctx, p1, p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    /**
     * 
     * @param {Graph} graph 
     * @param {CanvasRenderingContext2D} ctx Rendering Context 
     */
    drawGrid(graph, ctx) {
        //Horizontal lines
        const spacing = abs(this.minX - this.maxX) / 20
        for (let y = -graph.recalculatePoint({ x: 0, y: 0 }).y; y < graph.undoCalculate({ x: 0, y: 0 }).y; y++) {
            if (y % spacing == 0) {
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
            if (x % spacing == 0) {
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
    /**
     * 
     * @param {Graph} g1 First graph
     * @param {Graph} g2 Second Graph
     * @returns {Array.<{x: Number, y: Number}>} 
     */
    intersect(g1, g2) {
        let intersects = []
        const resolution = 0.1
        for (let i = 0; i < g1.points.length; i++) {
            let p1 = g1.points[i]
            let p2 = g2.points.filter(obj => obj.x == p1.x)[0]
            if (abs(parseFloat(p2.y.toFixed(2)) - parseFloat(p1.y.toFixed(2))) <= resolution) {
                let result = g1.undoCalculate({ x: parseFloat(p1.x.toFixed(2)), y: parseFloat(p1.y.toFixed(2)) })
                intersects.push({
                    x: parseFloat(result.x.toFixed(2)),
                    y: parseFloat(result.y.toFixed(2))
                })
            }
        }
        return intersects;
    }
    /**
     * Draws out the graphs
     * 
     * @param {Graph} graph 
     */
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
    /**
     * 
     * @param {String} type File format. PNG, JPEG, AVIP and WEPB supported.
     * @param {String} folder 
     * @param {String} fileName 
     * @returns {Buffer} File data
     */
    async generateImage(type, folder, fileName) {

        this.createCanvas(this.w, this.h);
        this.drawGrid(this.graphs[0], this.canvas.ctx)

        for (const graph of this.graphs) {
            this.drawGraph(graph);
        }

        const pngData = await this.canvas.canvas.encode(type);

        const dir = __dirname + '/..' + folder
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        await promises.writeFile(`${dir}${fileName}.${type}`, pngData);
        console.log("Done. Check graph.png")
        return pngData;
    }
}