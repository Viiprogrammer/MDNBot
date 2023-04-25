class DetaSessionAdapter {
  constructor (db) {
    this.db = db
  }

  async get (key) {
    return await this.db.get(key)
  }

  async set (key, value) {
    return await this.db.put(value, key)
  }
}

module.exports = { DetaSessionAdapter }
