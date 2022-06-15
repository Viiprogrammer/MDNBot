const { escapeHTML } = require('telegram-escape')
const { Markup } = require('telegraf')
const cheerio = require('cheerio')
const { md5 } = require('../utils')
const { MDN_API, LOCALE } = require('../config')

const { MDN } = require('../lib/mdn')
const mdn = new MDN({ apiUrl: MDN_API, defalutLocale: LOCALE })

module.exports = async ({ inlineQuery, answerInlineQuery }) => {
  const { documents } = await mdn.search(inlineQuery.query)
  if (!documents) return answerInlineQuery([])

  const pages = await mdn.getDocuments(documents)
  const aData = {}

  for (const docIndex in pages) {
    // eslint-disable-next-line camelcase
    const { data, mdn_url } = pages[docIndex]
    const $ = cheerio.load(data)
    const example = $('div > .code-example code').eq(0)?.text()
    const exampleTwo = $('div > .notranslate').eq(0)?.text()
    const tryItExample = $('.interactive').attr('src')
    let resultExample = null

    if (example.length < 200) {
      resultExample = escapeHTML(example)
    } else if (exampleTwo.length < 200) {
      resultExample = escapeHTML(exampleTwo)
    }

    aData[mdn_url] = {
      tryIt: tryItExample,
      example: resultExample
    }
  }

  // eslint-disable-next-line camelcase
  for (const docIndex in documents) {
    // eslint-disable-next-line camelcase
    const { title, mdn_url, summary } = documents[docIndex]
    const description = summary.replace(/\n\s{2}/g, ' ')

    const breadcumbs = mdn.getBreadcrumbsByUrl(mdn_url)
      .join('→')

    const dcoument = aData[mdn_url]

    const keyboard = [
      // eslint-disable-next-line camelcase
      [Markup.urlButton('🔗 MDN page', 'https://developer.mozilla.org' + mdn_url)]
    ]

    if (dcoument.tryIt !== undefined) {
      keyboard.push([Markup.urlButton('🪲 Try it', dcoument.tryIt)])
    }

    let message = `📎 <i>${breadcumbs}</i>\n\n` + escapeHTML(description)
    if (dcoument.example) {
      message += `\n\n<b><i>Syntax / Example: </i></b>\n\n<code>${dcoument.example}</code>`
    }

    documents[docIndex] = {
      type: 'article',
      id: md5(summary),
      title: title,
      cache_time: 1,
      description,
      input_message_content: {
        message_text: message,
        parse_mode: 'HTML'
      },
      reply_markup: Markup.inlineKeyboard(keyboard)
    }
  }

  return answerInlineQuery(documents)
}
