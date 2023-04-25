require('dotenv').config()
const { PORT, DETA_SPACE_APP_HOSTNAME, DETA_PROJECT_KEY } = process.env
const { createBot } = require('./bot')

async function start (webhook) {
  const bot = await createBot()

  process
    .once('SIGINT', () => bot.stop())
    .once('SIGTERM', () => bot.stop())

  if (webhook || DETA_PROJECT_KEY) {
    const botSecret = bot.secretPathComponent()

    bot.startWebhook(
      {
        path: '/bot',
        secret: botSecret
      },
      null,
      PORT, // Port
      (req, res) => { // Custom next handler
        res.statusCode = 403
        res.end('Not allowed!')
      }
    )

    bot.telegram.setWebhook(`https://${DETA_SPACE_APP_HOSTNAME}/bot`, { secret_token: botSecret })
  } else {
    await bot.launch()
  }
}

start()
