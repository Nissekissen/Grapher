# Grapher
Simple Grapher program using node.js.

Download and install the required dependencies with
```bash
git clone https://github.com/Nissekissen/Grapher.git
cd Grapher
npm install
```

You can either use the Renderer (as shown in the examples) or connect to the API. You start it with `npm start` and connect to the api in /api/graph (More on this in the [frontend README](https://github.com/Nissekissen/Grapher/tree/main/frontend/README.md). You can also read more about running it as files in the [examples README](https://github.com/Nissekissen/Grapher/tree/main/examples/README.md). I don't expect anyone to use this, since it's pretty pointless, but it has an MIT-lisence so you can copy, sell, modify the code however you want, I don't care.


Made with nodejs and it uses [mathjs](https://github.com/josdejong/mathjs) for expression parsing and [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) for image rendering. Also using [express](https://github.com/expressjs/express) for the frontend and API.
