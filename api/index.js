const express = require('express')
const app = express()
const router = express.Router()
const port = 10000;



router.get('/', (req, res) => {
    res.json({message: "Welcome to my API"})
})

app.use('/api', router)

app.listen(port, () => {
    console.log('API started at port ' + port)
})