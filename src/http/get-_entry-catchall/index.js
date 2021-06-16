const path = require('./path')
const read = require('./read')
const bundle = require('./bundle')
const ok = require('./responses/200')
const redirect = require('./responses/303')
const notfound = require('./responses/404')
const fatal = require('./responses/500')

exports.handler = http

/** bundles esmodules in views */
async function http (request) {
  try {
    // parse out the apigateway request
    let module = request.pathParameters.proxy

    // if origin does not exist this is 404
    let origin = path(module)
    if (!origin)
      return notfound(module)

    // respond with the unbundled file for debugging
    let debug = !!(process.env.ARC_DEBUG_ESM)
    if (debug)
      return ok(origin)

    // bundle+cache the requested file
    let cached = await read(module)
    if (!cached) {
      cached = await bundle(origin)
    }

    // ...and redirect to the cached file
    return redirect(cached)
  }
  catch (err) {
    return fatal(err)
  }
}
