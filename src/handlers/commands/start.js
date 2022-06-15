const { Extra, Markup } = require('telegraf')
const { BOT_USERNAME, BOT_REPO } = require('../../config')
module.exports = ctx => {
  return ctx.replyWithHTML(ctx.i18n.t('welcome.message'), Extra.markup(Markup.inlineKeyboard([
    [Markup.urlButton(ctx.i18n.t('welcome.buttons.github'), BOT_REPO)],
    [Markup.urlButton(ctx.i18n.t('welcome.buttons.addToChat'), `https://t.me/${BOT_USERNAME}?startgroup=add`)]
  ])).webPreview(false))
}
