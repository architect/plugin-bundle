/* 404 Not Found  indicates we can't find the requested resource
*/
module.exports = function notfound (file) {
  return {
    statusCode: 404,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: `<h1>404 not found: /views/${file}</h1>`
  }
}
