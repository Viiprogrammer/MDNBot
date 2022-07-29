const { i18n } = require('../middlewares')

module.exports = async ctx => {
  const [, lang] = ctx.match
  const locales = i18n.availableLocales()
  if (!locales.includes(lang)) return ctx.answerCbQuery()

  ctx.i18n.locale(lang);
  await ctx.answerCbQuery(
    ctx.i18n.t(`menu.langMenu.smile.${lang}`) + ' ' + ctx.i18n.t(`menu.langMenu.langs.${lang}`)
  )
  return ctx.deleteMessage()
}
