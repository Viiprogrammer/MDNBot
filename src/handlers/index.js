const { Composer, session } = require('telegraf')
const inlineQuery = require('./inline_query')
const { i18n } = require('./middlewares')
const { start } = require('./commands')
const handlersComposer = new Composer()

handlersComposer.use(session())
handlersComposer.use(i18n.middleware())
handlersComposer.start(start)
handlersComposer.on('inline_query', inlineQuery)

module.exports = handlersComposer
