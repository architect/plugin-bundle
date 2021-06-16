/** 500 Internal Server Error
 * indicates an unexpected condition that prevented it from fulfilling the request */
module.exports = function error (err) {
  console.error(err)
  return {
    statusCode: 500,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: `500 / ssr render error: ${err.message}`
  }
}
