require('dotenv').config()
const { bot } = require('./bot')

bot.launch()

process
  .once('SIGINT', () => bot.stop())
  .once('SIGTERM', () => bot.stop())
