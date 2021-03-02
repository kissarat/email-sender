const { logger } = require('./lib/winston');
const nodemailer = require('nodemailer')

const { emailQueue, smtpHost, smtpPort, smtpSender } = require('./config')
const { Queue } = require('./queue')

const transporter = nodemailer.createTransport({
    host: smtpHost(),
    port: smtpPort(),
    secure: false
  });

async function send(options) {
    const info = await transporter.sendMail({
        from: options.from || smtpSender(),
        to: options.to,
        subject: options.subject || 'MQTT test',
        text: options.text
      });
      // console.log(info)
      return info
}

async function main() {
  const queue = await Queue.get(emailQueue())
  if (queue) {
    queue.consume(async function(options) {
      try {
        const result = await send(options)
        logger.log(result)
      }
      catch (err) {
        logger.error(err)
        return false
      }
    })
  }
}

main()
