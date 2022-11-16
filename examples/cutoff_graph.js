const Renderer = require('../src/Renderer');

const renderer = new Renderer(
    [{ formula: 'x^3 / 50', minX: -5, maxX: 5, color: 'red', res: 0.1 }],
    500, // Image width
    500, // Image Height
    -10, // Smallest x value visible
    10, // Biggest x value visible
    -10, // Smallest y value visible
    10 // Biggest y value visible
);

(async () => {
    // Generate the image
    await renderer.generateImage('png', '/graphs/', 'cutoff');
})()