const join = require('path').join
const fs = require('fs')
const aws = require('aws-sdk')
const path = require('./path')

module.exports = read

/** returns the cached file path or false */
async function read (module) {
  let fn = process.env.NODE_ENV === 'testing' ? sandbox : lambda
  return fn(path(module))
}

/** read the metadata from the cache entry in s3 */
async function lambda (Key) {
  try {
    let s3 = new aws.S3
    let Bucket = process.env.ARC_STATIC_BUCKET
    let { Metadata } = await s3.headObject({ Bucket, Key }).promise()
    if (Metadata.cached)
      return Metadata.cached
  }
  catch (e) {
    console.log(e)
  }
  return false
}

/** read the metadata from local node_modules */
async function sandbox (Key) {
  let projectRoot = join(process.cwd(), '..', '..', '..')
  let pathToJSON = join(projectRoot, 'node_modules', '@architect', 'bundles.json')
  if (fs.existsSync(pathToJSON)) {
    try {
      let ledger = JSON.parse(fs.readFileSync(pathToJSON).toString())
      if (ledger[Key]) return ledger[Key]
    }
    catch (e) {
      console.log(e)
    }
  }
  return false
}
