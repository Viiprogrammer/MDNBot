const crypto = require('crypto')

function md5 (data) {
  return crypto.createHash('md5')
    .update(data)
    .digest('hex')
}

function sliceArray (arr, limit) {
  const size = Math.ceil(arr.length / limit)
  const result = []

  for (let i = 0; i < Math.ceil(arr.length / size); i++) {
    result[i] = arr.slice((i * size), (i * size) + size)
  }

  return result
}

module.exports = { md5, sliceArray }
