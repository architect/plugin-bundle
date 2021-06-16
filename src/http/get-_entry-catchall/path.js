const { existsSync } = require('fs')
const { join } = require('path')

module.exports = path

// cheap cache for warm Lambda
const cache = {}

/** returns path to origin or false */
function path (pathToFile) {
  if (!(pathToFile in cache)) {
    let origin = join(process.cwd(), 'node_modules', '@architect', 'views', pathToFile)
    cache[pathToFile] = existsSync(origin) ? origin : false
  }
  return cache[pathToFile]
}
