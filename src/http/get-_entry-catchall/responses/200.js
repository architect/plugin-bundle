const { promisify } = require('util')
const { readFile } = require('fs')
const read = promisify(readFile)

/**
 * 200 OK success status response code indicates that the request has succeeded
 *
 * In this case: we read a JS file and send as the response
 */
module.exports = async function ok (module) {
  let js = await read(module)
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/javascript; charset=utf8'
    },
    body: js.toString()
  }
}
