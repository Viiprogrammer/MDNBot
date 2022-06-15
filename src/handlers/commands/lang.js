const { Markup, Extra } = require('telegraf')
const { i18n } = require('../middlewares')
const { sliceArray } = require('../../utils')

module.exports = ctx => {
  const locales = i18n.availableLocales()
  return ctx.reply(
    locales.map(name => ctx.i18n.t(`menu.langMenu.smile.${name}`) + ' ' + ctx.i18n.t(`menu.langMenu.message.${name}`))
      .join('\n'),
    Extra.markup(
      Markup.inlineKeyboard(
        sliceArray(
          locales.map(name =>
            Markup.callbackButton(ctx.i18n.t(`menu.langMenu.smile.${name}`) + ' ' + ctx.i18n.t(`menu.langMenu.langs.${name}`), `lang:${name}`)
          ),
          2
        )
      )
    )
  )
}
