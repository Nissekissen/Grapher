# Frontend part of Grapher

This is the frontend part of the grapher program. Start the frontend with `npm start` and you can access the static web pages just with `localhost:10000` and the api with `localhost:10000/api/graph`.

The API needs two headers, both in string form. Here is an example for the headers.

```js
const headers = {
    "renderer":
        '{ "minX": -10, "maxX": 10, "minY": -10"maxY": 10, "w": 500, "h": 500 }',
    "graphs": [
        '{ "formula": "sin(x)", "minX": -10, "maxX"10, "color": "red", "res": 0.1 }',
        '{ "formula": "x^2/10", "minX": -10, "maxX"10, "color": "red", "res": 0.1 }'
    ]
}
```

The API returns a buffer with data for a png image, which means that you can take the data from the response and put it in a file ending with `.png`.

The API `renderer` header has the same fields as the `Renderer` object. The `graphs` header uses the same syntax as the graph argument for the renderer.

Here is an exampe of using the data with `node-fetch`:

```js
(async () => {
    const res = await fetch("http://localhost:10000/api/graph", {
        method: "GET",
        headers: {
            "renderer":
                '{ "minX": -10, "maxX": 10, "minY": -10, "maxY": 10, "w": 500, "h": 500 }',
            "graphs": [
                '{ "formula": "sin(x)", "minX": -10, "maxX"> 10, "color": "red", "res": 0.1 }',
                '{ "formula": "x^2/10", "minX": -10, "maxX"> 10, "color": "red", "res": 0.1 }'
            ]
        }
    });
    console.log(res.status);
    if (res.status == 200) {
        const blob = await res.blob();
        console.log(blob);
        const buffer = Buffer.from(await blob.arrayBuffer());
        fs.writeFileSync("./test.png", buffer);
    }

    
})();

```

This puts the data in a `test.png` file.