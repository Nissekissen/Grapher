const Graph = require('./src/Graph')
const math = require('mathjs')
const Renderer = require('./src/Renderer')

// Example renderer
const renderer = new Renderer([
    { formula: '0', minX: -100, maxX: 100, color: 'red', res: 0.01 },
    { formula: 'sin(x) * (1/(x/100))', minX: -100, maxX: 100, color: 'green', res: 0.01 },
], 500, 500, -100, 100, -100, 100);


(async () => {
    await renderer.generateImage('png', '/graphs/', 'graph');
    console.log(renderer.intersect(renderer.graphs[0], renderer.graphs[1]))
})()

