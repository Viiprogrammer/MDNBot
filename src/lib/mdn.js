const { fetch, Agent } = require('undici')

class MDN {
  constructor ({ apiUrl = 'https://developer.mozilla.org', defalutLocale = 'en-US' } = {}) {
    this._apiUrl = apiUrl
    this.defaultLocale = defalutLocale
    this.agent = new Agent({
      keepAliveTimeout: 10,
      keepAliveMaxTimeout: 10
    })
  }

  async _request (path, { url: apiUrl, qs = {}, method }) {
    const url = new URL('/api' + path, apiUrl ?? this._apiUrl)
    url.search = new URLSearchParams(qs)
    return fetch(url, {
      dispatcher: this.agent,
      method: method || 'GET'
    })
  }

  async search (query, locale) {
    const result = await this._request('/v1/search', { qs: { locale: locale ?? this.defaultLocale, q: query } })
    return result.json()
  }

  getBreadcrumbsByUrl (url) {
    let breadcrumbs = url
      .split('/')
      .slice(2)

    breadcrumbs[0] = breadcrumbs[0].charAt(0).toUpperCase() + breadcrumbs[0].slice(1)
    breadcrumbs = breadcrumbs.slice(0, -1).concat(breadcrumbs.slice(-1)[0].replace(/_/g, ' '))
    return breadcrumbs
  }

  async getDocuments (documents) {
    // eslint-disable-next-line camelcase
    const promises = documents.map(({ mdn_url }) => {
      return this._request(mdn_url, { url: 'https://developer.mozilla.org' })
        .then((data) => ({ mdn_url, data }))
    })
    const result = await Promise.allSettled(promises)

    return result
      .filter(({ status }) => status === 'fulfilled')
      .map(({ value }) => {
        value.data = value.data.text()
        return value
      })
  }
}

module.exports = { MDN }
