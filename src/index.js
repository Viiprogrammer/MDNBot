require('dotenv').config()
const { bot } = require('./bot')

process
  .once('SIGINT', () => bot.stop())
  .once('SIGTERM', () => bot.stop())
