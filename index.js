// Entery point for deta.sh
require('dotenv').config()

const { bot } = require('./src/bot')
const crypto = require('crypto')
const app = require('express')()

const webhookPath = `/opengram/${crypto.randomBytes(32).toString('hex')}`

app.use(bot.webhookCallback(webhookPath))

bot.telegram.setWebhook(`https://${process.env.DETA_PATH}.deta.dev` + webhookPath, { drop_pending_updates: true })
  .then(console.log)

process
  .once('SIGINT', () => bot.stop())
  .once('SIGTERM', () => bot.stop())

module.exports = app
