const Graph = require('./src/Graph')
const math = require('mathjs')

const formula = "x^2"

const test = new Graph(formula, -100, 100, -100, 100)



async function main() {
    await test.generateImage(0);
}
main();

