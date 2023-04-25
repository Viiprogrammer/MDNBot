require('dotenv').config()
const { createBot } = require('./bot')

async function start () {
  const bot = await createBot()

  process
    .once('SIGINT', () => bot.stop())
    .once('SIGTERM', () => bot.stop())
  await bot.launch()
}

start()
