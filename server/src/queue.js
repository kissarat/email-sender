const AMQPClient = require('amqplib')

const { queueConnectionUrl } = require('./config')

class Queue {
    constructor(url, name) {
        this.url = url
        this.name = name
    }

    async connect() {
        if (!this.connection) {
            this.connection = await AMQPClient.connect(this.url);
            [this.output, this.input] = await Promise.all([0, 1].map(async () => {
                const channel = await this.connection.createChannel()
                await channel.assertQueue(this.name)
                return channel
            }))
        }
        return this.connection
    }

    async publish(message) {
        return this.output.sendToQueue(this.name, Buffer.from(JSON.stringify(message)), {
            // persistant: true,
            contentType: 'application/json',
            messageId: message.id.toString()
        })
    }

    consume(cb) {
        this.input.consume(this.name, function({ content }) {
            const json = content.toString()
            const message = JSON.parse(json)
            cb(message)
        }, {
            noAck: false
        })
    }

    static async get(name = 'order') {
        let queue = Queue.queues[name]
        if (!queue) {
            queue = new Queue(queueConnectionUrl(), name)
            await queue.connect()
            Queue.queues[name] = queue
        }
        return queue
    }

    static async publish(name, message) {
        const queue = await Queue.get(name)
        return queue.publish(message)       
    }

    static async consume(name, cb) {
        const queue = await Queue.get(name)
        return queue.consume(cb)       
    }
}

Queue.queues = {}

module.exports = { Queue }
