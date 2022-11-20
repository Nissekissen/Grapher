const express = require('express')
const app = express()
const port = 10000;

app.get('./', (req, res) => {
    res.send("test")
})

app.listen(port, () => {
    console.log('API started at port ' + port)
})