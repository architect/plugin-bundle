/** redirect to a given resource */
module.exports = function redirect (location) {
  return {
    statusCode: 303,
    headers: {
      'content-type': 'text/javascript',
      'location': location,
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    }
  }
}
