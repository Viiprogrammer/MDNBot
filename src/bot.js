const { Telegraf } = require('telegraf')
const { BOT_TOKEN } = require('./config')
const bot = new Telegraf(BOT_TOKEN)

const handlers = require('./handlers')

bot.use(handlers)

bot.catch(error => {
  console.log(error)
})

bot.launch()

module.exports = { bot }
