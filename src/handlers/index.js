const { Composer } = require('opengram')
const inlineQuery = require('./inline_query')

const { start, lang } = require('./commands')
const { lang: langAction } = require('./actions')
const handlersComposer = new Composer()

handlersComposer.start(start)
handlersComposer.command('lang', lang)
handlersComposer.action(/lang:([a-z]{2})/, langAction)

handlersComposer.on('inline_query', inlineQuery)

module.exports = handlersComposer
