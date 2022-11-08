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

        this.handleX = x => {
            let newFormula = formula
            if (x < 0) {
                newFormula = newFormula.replaceAll('x', `(${x})`);
            } else {
                newFormula = newFormula.replaceAll('x', x);
            }
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
        newPoint.y = -(point.y + this.minY)
        return newPoint
    }
    async generateImage(resolution) {
        const canvas = new CanvasBuilder(this.maxX - this.minX, this.maxY - this.minY);

        canvas.ctx.fillStyle = 'white';
        canvas.ctx.fillRect(0, 0, canvas.w, canvas.h)

        for (let point of this.points) {
            point = this.recalculatePoint(point);
            
        }

        

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