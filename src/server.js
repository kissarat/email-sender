const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const { getWinstonHttpLogger } = require('./server/lib/winston')
require('./server/lib/axios')

const app = express();

//parse request to body-parser
app.use(bodyParser.urlencoded({
    // extended: true
}))

app.use(cookieParser())

app.use(bodyParser.json({ type: 'application/json' }))

//set view engine
app.set("view engine", "ejs")

app.use(getWinstonHttpLogger())

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))

//load routers
// app.use('/', require('./server/routes/router'))

app.use(function (err, req, res, next) {
    res
        .status(500)
        .json(err.response && err.response.data ? err.response.data : {
            message: err.message,
            stack: (err.stack || '').split('\n')
        })
})
// app.use(getWinstonExpressErrorLogger())


server.listen(process.env.PORT, process.env.HOST, function() {
    console.log(`Server started at http://${process.env.HOST}:${process.env.PORT}`)
})
