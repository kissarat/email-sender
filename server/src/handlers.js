const { smtpSender, emailQueue } = require('./config')
const { Queue } = require('./queue')

async function publish(req, res, next) {
    try {
        const queue = req.body.queue || emailQueue()
         const data = await Queue.publish(queue, {
             id: req.body.id,
             from: req.body.from,
             to: req.body.to,
             subject: req.body.subject,
             text: req.body.text
         })
         if ('form' === req.query.redirect) {
            res.redirect(`/?id=${req.body.id}#${queue}`)
         } else {
            res.json({
                ok: data ? 1 : 0,
                id: req.body.id
            })
         }
    } catch (err) {
        next(err)
    }
}

function getClientConfig(req, res) {
    res.json({
        ok: 1,
        data: {
            queue: emailQueue(),
            sender: smtpSender()
        }
    })
}

module.exports = { publish, getClientConfig }
