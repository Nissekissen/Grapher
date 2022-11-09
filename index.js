const Graph = require('./src/Graph')
const math = require('mathjs')

const formula = "sin(x)"

const test = new Graph(formula, -100, 100, -10, 10)



async function main() {
    await test.generateImage(0);
}
main();

