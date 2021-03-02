const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const { getWinstonHttpLogger } = require('./lib/winston');
const { httpPort, httpHost, queueConnectionUrl, emailQueue } = require('./config');
const { publish, getClientConfig } = require('./handlers');
const { Queue } = require('./queue');

const app = express();

//parse request to body-parser
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(getWinstonHttpLogger())

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))

app.get('/config', getClientConfig)
app.post('/send/email', publish)

app.use(function (err, req, res, next) {
    res
        .status(500)
        .json(err.response && err.response.data ? err.response.data : {
            message: err.message,
            stack: (err.stack || '').split('\n')
        })
})
// app.use(getWinstonExpressErrorLogger())


async function main() {
    try {
        // Connection test to RabbitMQ
        await Queue.get(emailQueue())
        console.log(`Connected to ${queueConnectionUrl()} RabbitMQ`)
    } catch (err) {
        console.error(`Cannot connect to ${queueConnectionUrl()} RabbitMQ`, err)
        return
    }

    app.listen(httpPort(), httpHost(), function () {
        console.log(`Server started at http://${httpHost()}:${httpPort()}`)
    })
}

main()
