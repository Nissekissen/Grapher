const math = require('mathjs');
const CanvasBuilder = require('./canvasBuilder');
const { promises } = require('fs')
const { join } = require('path')

/** @class Graph */
module.exports = class Graph {
    /**
     * 
     * 
     * @author Nissekissen
     * @param {String} formula Formula for the graph ex. `'2x+3'`
     * @param {Number} minX Smallest x value visible
     * @param {Number} maxX Biggest x value visible
     * @param {Number} minY Smallest y value visible
     * @param {Number} maxY Biggest y value visible
     * @param {Number} res The resolution of the calculation. Ex. `0.1`
     * @param {Number} w Screen width (px)
     * @param {Number} h Screen height (px)
     * @param {Number} start Start point of the function
     * @param {Number} stop Stop point of the function
     * @param {String} color Function color. ex. `'red'`
     * 
     * Example:
     * ```javascript
     * //Simple Graph
     * const graph = new Graph('2x+3', -100, 100, -100, 100, 0.1, 500, 500, -10, 10, 'red');
     * 
     * ```
     */
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

        /** @private */ this.handleX = x => {
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
    /**
     * Converts graph output coordinate to screen coordinate
     * 
     * @param {{x: Number, y: Number}} point The point to recalculate
     * @returns {{x: Number, y: Number}}
     */
    recalculatePoint(point) {
        let newPoint = point;
        newPoint.x = point.x - this.minX;
        newPoint.x = newPoint.x * ((this.w / 2) / this.maxX)
        newPoint.y = -(point.y + this.minY)
        newPoint.y = newPoint.y * ((this.h / 2) / this.maxY)
        return newPoint
    }
    /**
     * Converts screen coordinate to graph output
     * 
     * @param {{x: Number, y: Number}} point The point to recalculate 
     * @returns {{x: Number, y: Number}}
     */
    undoCalculate(point) {
        let newPoint = point;
        newPoint.x = newPoint.x / ((this.w / 2) / this.maxX)
        newPoint.x = newPoint.x + this.minX;
        newPoint.y = newPoint.y / ((this.h / 2) / this.maxY)
        newPoint.y = -(newPoint.y + this.minY);
        return newPoint;
    }
}