const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const { getWinstonHttpLogger } = require('./lib/winston');
const { httpPort, httpHost } = require('./config');

const app = express();

//parse request to body-parser
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(getWinstonHttpLogger())

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))

app.use(function (err, req, res, next) {
    res
        .status(500)
        .json(err.response && err.response.data ? err.response.data : {
            message: err.message,
            stack: (err.stack || '').split('\n')
        })
})
// app.use(getWinstonExpressErrorLogger())


app.listen(httpPort(), httpHost(), function() {
    console.log(`Server started at http://${httpHost()}:${httpPort()}`)
})
