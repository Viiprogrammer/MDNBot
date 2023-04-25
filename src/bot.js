const path = require('path')
const { Opengram, session } = require('opengram')
const { BOT_TOKEN, isProd, DETA_PROJECT_KEY } = require('./config')

const bot = new Opengram(BOT_TOKEN, { webhookReply: false })
const handlers = require('./handlers')

const { i18n: { i18nFactory } } = require('./handlers/middlewares')
const i18next = require('i18next')
const i18NextFsBackend = require('i18next-fs-backend')
const { DetaSessionAdapter } = require('./lib/deta-store')

const { Deta } = require('deta')
const deta = Deta()
const sessions = deta.Base('sessions')

async function createBot () {
  await i18next
    .use(i18NextFsBackend)
    .init({
      lng: 'ru',
      languages: ['en', 'ru', 'ua'],
      fallbackLng: 'ru',
      debug: !isProd,
      backend: {
        loadPath: path.resolve('./locales/{{lng}}/{{ns}}.yaml')
      }
    })

  bot.use(
    session({
      store: DETA_PROJECT_KEY ? new DetaSessionAdapter(sessions) : undefined,
      /**
       * Session key generator
       *
       * @param {OpengramContext} ctx Context
       * @return {null|string}
       */
      getSessionKey: (ctx) => {
        if (ctx.from.id && ctx.chat?.id) {
          return `${ctx.from.id}:${ctx.chat.id}`
        }

        if (ctx.inlineQuery || ctx.callbackQuery?.inline_message_id) {
          return `${ctx.from.id}:${ctx.from.id}`
        }

        return null
      }
    })
  )
  bot.use(i18nFactory(i18next))

  bot.use(handlers)

  bot.catch(error => {
    console.log(error)
  })

  return bot
}

module.exports = { createBot }
