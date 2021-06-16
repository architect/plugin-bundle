const rollup = require('rollup')
const aws = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const inventory = require('@architect/inventory')
const fingerprint = require('./fingerprint')

module.exports = async function bundle (requested) {

  // generate bundle
  let bundle = await rollup.rollup({
    input: requested
  })

  let bundled = await bundle.generate({
    format: 'esm'
  })

  let js = bundled.output[0].code
  let name = fingerprint(requested, js)
  let cache = {}

  // write the file and cache entry
  if (process.env.NODE_ENV === 'testing') {

    // write to local
    let projectRoot = path.join(process.cwd(), '..', '..', '..')
    let { inv } = await inventory({ env: false, cwd: projectRoot })
    fs.mkdirSync(path.join(projectRoot, inv.static.folder, 'bundles'), { recursive: true })
    let file = path.join(projectRoot, inv.static.folder, 'bundles', name)
    fs.writeFileSync(file, js)

    // write to node_modules/@architect/bundle.json
    let pathToJSON = path.join(projectRoot, 'node_modules', '@architect', 'bundles.json')
    if (fs.existsSync(pathToJSON)) {
      cache = JSON.parse(fs.readFileSync(pathToJSON).toString())
    }
    cache[requested] = '/' + path.join('_static', 'bundles', name)
    fs.writeFileSync(pathToJSON, JSON.stringify(cache))
  }
  else {
    // write the bundle to s3
    let s3 = new aws.S3
    await s3.putObject({
      Bucket: process.env.ARC_STATIC_BUCKET,
      Key: path.join('bundles', name),
      Body: js
    }).promise()

    // write Metadata on the origin file
    await s3.copyObject({
      Bucket: process.env.ARC_STATIC_BUCKET,
      Key: requested,
      Metadata: {
        bundle: '/' + path.join('_static', 'bundles', name)
      },
      MetadataDirective: 'COPY'
    }).promise()
  }

  return cache[requested]
}
