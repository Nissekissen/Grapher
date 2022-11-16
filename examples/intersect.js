const Renderer = require('../src/Renderer')

const renderer = new Renderer(
    [
        { formula: '2x+3', minX: -10, maxX: 10, color: 'red', res: 0.01 },
        { formula: '5', minX: -10, maxX: 10, color: 'green', res: 0.01 }
        // For the intersect function to work, they both must have the same resolution.
    ],
    500, // Image width
    500, // Image Height
    -10, // Smallest x value visible
    10, // Biggest x value visible
    -10, // Smallest y value visible
    10 // Biggest y value visible
);

(async () => {
    // Render the image
    await renderer.generateImage('png', '/graphs/', 'intersect');
    // Log the intersect points of the two graphs.
    console.log(renderer.intersect(renderer.graphs[0], renderer.graphs[1]));
})()