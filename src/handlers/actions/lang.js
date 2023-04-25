module.exports = async ctx => {
  const [, lang] = ctx.match
  const locales = ctx.i18n.options.languages
  if (!locales.includes(lang)) return ctx.answerCbQuery()

  await ctx.i18n.changeLanguage(lang)

  await ctx.answerCbQuery(
    ctx.i18n.t(`menu.langMenu.smile.${lang}`) + ' ' + ctx.i18n.t(`menu.langMenu.langs.${lang}`)
  )
  return ctx.deleteMessage()
}
