const express = require('express');
const fs = require('fs')
const Renderer = require('../src/Renderer');
const app = express()
const router = express.Router()
const port = 10000;



router.get('/', (req, res) => {
    res.json({message: "Welcome to my API"})
})

router.route('/graph').get(async (req, res) => {
    if (!req.headers.renderer) return res.status(400).json({message: "Invalid headers. \"Renderer\" header is required."})
    if (!req.headers.graphs) return res.status(400).json({message: "Invalid headers. \"Graphs\" header is required."})
    
    try {
        const rd = JSON.parse(req.headers.renderer)
        const graphsData = JSON.parse(req.headers.graphs)
        const renderer = new Renderer(
            graphsData,
            rd.w,
            rd.h,
            rd.minX,
            rd.maxX,
            rd.minY,
            rd.maxY
        )
        const pngData = await renderer.generateImage('png', '', '', false)
        res.end(pngData.toString())
    } catch (error) {
        console.error(error)
        console.log(graphsData)
        res.status(400).json({message: "Bad request.", "errorCode": error.constructor.name})
        
    }
    
})

app.use('/api', router)

app.listen(port, () => {
    console.log('API started at port ' + port)
})