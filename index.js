const Graph = require('./src/Graph')
const math = require('mathjs')
const Renderer = require('./src/Renderer')

// Example renderer
const renderer = new Renderer([
    { formula: 'x^2/100', minX: -100, maxX: 100, color: 'red', res: 0.1 },
], 1000, 1000, -100, 100, -100, 100);


async function main() {
    await renderer.generateImage('png', '/graphs/', 'graph');
}
main();

