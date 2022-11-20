const express = require('express')
const app = express()
const port = 80

app.get('/api', (req, res) => {
    res.send("test")
})

app.listen(port, () => {
    console.log('API started')
})