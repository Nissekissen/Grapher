const express = require('express');
const app = express()
const router = express.Router()
const port = 10000;

const api = require('./api/index');

router.route('/graph', api);

app.use('/api', router)

app.use(express.static('frontend/src'));

app.listen(port, () => {
    console.log('API started at port ' + port)
})