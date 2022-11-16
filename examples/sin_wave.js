const Renderer = require('../src/Renderer')

const renderer = new Renderer(
    [{ formula: 'sin(x)', minX: -10, maxX: 10, color: 'red', res: 0.1 }],
    500, // Image width
    500, // Image Height
    -10, // Smallest x value visible
    10, // Biggest x value visible
    -10, // Smallest y value visible
    10 // Biggest y value visible
);

(async () => {
    await renderer.generateImage('png', '/graphs/', 'example');
})()