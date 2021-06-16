let path = require('path')
let src = path.join(__dirname, '..', 'http', 'get-_entry-catchall')

/** creates the runtime infra with cloudformation */
async function pkg ({ arc, cloudformation, stage='staging', inventory, createFunction }) {
  // add /_entry route to api gateway
  // add the invoke permission
  // add the lambda resource and point to src/http/get-_entry-catchall
  // ensure the lambda is hydrated with the local src/views directory
}

/** creates the authortime infra for sandbox */
async function start ({ arc, inventory, invokeFunction, services }) {
  // adds get /_entry route
  services.http.get('/_entry/*', function (req, res) {
    let fn = require(src)
    fn.handler({ pathParameters: { proxy: req.originalUrl }}).then(function(result) {
      res.statusCode = result.statusCode
      res.setHeader('Content-Type', result.headers['content-type'] || 'text/javascript; charset=utf-8')
      res.end(result.body)
    }).catch(function(err) {
      console.log(err) 
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(err.message)
    })
    /*
    let payload = { pathParameters: { proxy: req.originalUrl }}
    invokeFunction({src, payload}, function (err, result) {
      if (err) {
        console.log('plugin-bundle error', err)
      }
      else {
        console.log('got result', result)
      }
      res.end(req.originalUrl)
    })*/
  })
}

module.exports = {
  package: pkg,
  functions: ()=>([{ src }]),
  sandbox: { start }
}
