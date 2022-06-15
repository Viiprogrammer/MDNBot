const { Composer } = require('telegraf')
const inlineQuery = require('./inline_query')

const handlersComposer = new Composer()

handlersComposer.on('inline_query', inlineQuery)

module.exports = handlersComposer
