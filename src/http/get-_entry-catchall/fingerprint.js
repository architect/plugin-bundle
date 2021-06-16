const crypto = require('crypto')

module.exports = function fingerprint (filename, contents) {
  // Hash (buffer) contents
  if (!(contents instanceof Buffer)) contents = new Buffer.from(contents)
  let hash = crypto.createHash('sha1')
  hash.update(contents)
  let sha = hash.digest('hex').substr(0, 10)

  // Modify module filename
  let path = filename.split('.js')
  path[path.length - 2] = `${path[path.length - 2]}-${sha}`
  let tmp = path.join('.js')
  return tmp.split('@architect/views')[1]
}
