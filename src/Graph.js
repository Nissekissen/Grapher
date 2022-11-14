const math = require('mathjs');
const CanvasBuilder = require('./canvasBuilder');
const { promises } = require('fs')
const { join } = require('path')

module.exports = class Graph {
    constructor(formula, minX, maxX, minY, maxY, res, w, h, start, stop, color) {
        this.points = [];
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.w = w;
        this.h = h;
        this.res = res
        this.start = start;
        this.stop = stop;
        this.color = color;

        this.handleX = x => {
            let newFormula = formula
            newFormula = newFormula.replaceAll('x', `(${x})`);
            return math.evaluate(newFormula)
        }

        for (let i = start; i <= stop; i+=this.res) {
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
        newPoint.y = -(newPoint.y + this.minY);
        return newPoint;
    }
    // async generateImage(resolution) {
    //     const canvas = new CanvasBuilder(this.w, this.h);

    //     canvas.ctx.fillStyle = 'white';
    //     canvas.ctx.fillRect(0, 0, canvas.w, canvas.h)

    //     for (let point of this.points) {
    //         point = this.recalculatePoint(point);
    //     }

    //     for (const point of this.points) {
    //         let i = this.points.indexOf(point);
    //         if (i < this.points.length-1) {
    //             let otherPoint = this.points[i+1];
    //             canvas.ctx.strokeStyle = "black";
    //             canvas.ctx.lineWidth = 2;
    //             this.line(canvas.ctx, point, otherPoint);
    //         }
    //     }

    //     const pngData = await canvas.canvas.encode('png')

    //     await promises.writeFile('./graphs/graph.png', pngData);
    //     console.log("Done. Check graph.png")
    // }

}