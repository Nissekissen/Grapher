const math = require('mathjs');
const CanvasBuilder = require('./canvasBuilder');
const { promises } = require('fs')
const { join } = require('path')

class Graph {
    constructor(formula, minX, maxX, minY, maxY) {
        this.points = [];
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.w = 1000;
        this.h = 1000;

        this.handleX = x => {
            let newFormula = formula
            newFormula = newFormula.replaceAll('x', `(${x})`);
            return math.evaluate(newFormula)
        }

        for (let i = minX; i <= maxX; i++) {
            let obj = {
                x: i,
                y: this.handleX(i)
            }
            this.points.push(obj);
        }
    }
    recalculatePoint(point) {
        let newPoint = point;
        newPoint.x = point.x - this.minX;
        newPoint.x = newPoint.x * ((this.w / 2) / this.maxX)
        newPoint.y = -(point.y + this.minY)
        newPoint.y = newPoint.y * ((this.h / 2) / this.maxY)
        return newPoint
    }
    undoCalculate(point) {
        let newPoint = point;
        newPoint.x = newPoint.x / ((this.w / 2) / this.maxX)
        newPoint.x = newPoint.x + this.minX;
        newPoint.y = newPoint.y / ((this.h / 2) / this.maxY)
        newPoint.y = newPoint.y + this.minY;
        return newPoint;
    }
    line(ctx, p1, p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    drawGrid(ctx) {
        //Horizontal lines
        for (let y = -this.recalculatePoint({ x: 0, y: 0 }).y; y < this.undoCalculate({ x: 0, y: this.h }).y; y++) {
            if (y % 10 == 0) {
                if (y == 0) { ctx.lineWidth = 2; }
                else { ctx.lineWidth = 1; }
                let p1 = this.recalculatePoint({ x: this.minX, y: y });
                p1.x = 0;
                let p2 = this.recalculatePoint({ x: this.maxX, y: y });
                p2.x = this.w;
                this.line(ctx, p1, p2);
            }
        }

        // Vertical lines
        for (let x = -this.recalculatePoint({ x: 0, y: 0 }).x; x < this.undoCalculate({ x: this.w, y: 0 }).x; x++) {
            if (x % 10 == 0) {
                if (x == 0) { ctx.lineWidth = 2; }
                else { ctx.lineWidth = 1; }
                let p1 = this.recalculatePoint({ x: x, y: this.minY });
                p1.y = 0;
                let p2 = this.recalculatePoint({ x: x, y: this.maxY });
                p2.y = this.h;
                this.line(ctx, p1, p2);
            }
        }
    }
    async generateImage(resolution) {
        const canvas = new CanvasBuilder(this.w, this.h);

        canvas.ctx.fillStyle = 'white';
        canvas.ctx.fillRect(0, 0, canvas.w, canvas.h)

        for (let point of this.points) {
            point = this.recalculatePoint(point);
            
        }

        this.drawGrid(canvas.ctx);

        for (const point of this.points) {
            let i = this.points.indexOf(point);
            if (i < this.points.length-1) {
                let otherPoint = this.points[i+1];
                canvas.ctx.strokeStyle = "black";
                canvas.ctx.lineWidth = 2;
                canvas.ctx.beginPath();
                canvas.ctx.moveTo(point.x, point.y);
                canvas.ctx.lineTo(otherPoint.x, otherPoint.y);
                canvas.ctx.stroke();
            }
        }

        const pngData = await canvas.canvas.encode('png')

        await promises.writeFile('./graphs/graph.png', pngData);
        console.log("Done. Check graph.png")
    }

}

module.exports = Graph;