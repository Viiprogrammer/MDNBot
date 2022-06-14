require('dotenv').config()
const { escapeHTML } = require('telegram-escape')
const { Telegraf, Markup } = require('telegraf')
const fetch = require('node-fetch').default
const cheerio = require('cheerio')
const { md5 } = require('./utils')

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
  console.log(inlineQuery.query)
  console.clear()
  const apiUrl = `https://developer.mozilla.org/api/v1/search?locale=en-US&q=${inlineQuery.query}`
  const response = await fetch(apiUrl)
  const { documents } = await response.json()
  if (!documents) return await answerInlineQuery([])

  let additionalData = []
  let aData = {}
  additionalData = documents.map(function ({ mdn_url }) {
    return fetch('https://developer.mozilla.org' + mdn_url)
      .then((data) => ({ data, mdn_url }))
  })

  additionalData = await Promise.allSettled(additionalData)
  additionalData = additionalData.filter(({ status }) => status === 'fulfilled')
  for (const docIndex in additionalData) {
    const page = additionalData[docIndex].value
    const html = await page.data.text()
    const $ = cheerio.load(html)
    const example = $('div > .code-example code').eq(0)?.text()
    const exampleTwo = $('div > .notranslate').eq(0)?.text()
    aData[page.mdn_url] = {
      tryIt: $('.interactive').attr('src'),
      example: example.length < 200 ? escapeHTML(example) : exampleTwo.length < 200 ? escapeHTML(exampleTwo) : null
    }
  }
  console.log(aData)

  // eslint-disable-next-line camelcase
  for (const docIndex in documents) {
    // eslint-disable-next-line camelcase
    const { title, mdn_url, summary } = documents[docIndex]
    const description = summary.replace(/\n\s{2}/g, ' ')
    let mdnPath = mdn_url
      .split('/')
      .slice(2)
    mdnPath[0] = mdnPath[0].charAt(0).toUpperCase() + mdnPath[0].slice(1)
    mdnPath = mdnPath.slice(0, -1).concat(mdnPath.slice(-1)[0].replace(/_/g, ' '))
    mdnPath = mdnPath.join(' → ')
    const keyboard = [
      // eslint-disable-next-line camelcase
      [Markup.urlButton('🔗 MDN page', 'https://developer.mozilla.org' + mdn_url)]
    ]
    const descData = aData[mdn_url]
    if (descData.tryIt !== undefined) keyboard.push([Markup.urlButton('🪲 Try it', descData.tryIt)])
    let message = `📎 <i>${mdnPath}</i>\n\n` + escapeHTML(description)
    if (descData.example) {
      message += `\n\n<b><i>Syntax / Example: </i></b>\n\n<code>${descData.example}</code>`
    }

    documents[docIndex] = {
      type: 'article',
      id: md5(summary),
      title: title,
      switch_pm_text: 'fdsfsdf',
      cache_time: 1,
      description,
      input_message_content: {
        message_text: message,
        parse_mode: 'HTML'
      },
      reply_markup: Markup.inlineKeyboard(keyboard)
    }
  }
  console.log(documents)
  return await answerInlineQuery(documents)
})
bot.gameQuery((ctx) => console.log(ctx))
bot.on('chosen_inline_result', ({ chosenInlineResult }) => {
  console.log('chosen inline result', chosenInlineResult)
})

bot.start((ctx) => {
  return ctx.reply('Hi')
})

bot.catch(console.log)
bot.telegram.deleteWebhook({ drop_pending_updates: true })
  .then(() => {
    return bot.launch()
  })

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
