const express = require('express');
const fs = require('fs')
const Renderer = require('../../src/Renderer');


module.exports = async (req, res) => {
    if (!req.headers.renderer) return res.status(400).json({message: "Invalid headers. \"Renderer\" header is required."})
    if (!req.headers.graphs) return res.status(400).json({message: "Invalid headers. \"Graphs\" header is required."})
    
    try {
        console.log(JSON.stringify(req.headers.renderer))
        const rd = JSON.parse(req.headers.renderer)
        console.log(req.headers.graphs)
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
        res.send(pngData)
    } catch (error) {
        console.error(error)
        res.status(400).json({message: "Bad request.", "errorCode": error.constructor.name})
        
    }
    
}

