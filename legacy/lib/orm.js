
const crypto = require('crypto')
const AWS = require('aws-sdk')

// Get our config with credentials
const { aws: awsConfig } = require('../config')
// Create S3 service object
const s3 = new AWS.S3(awsConfig)

// Taken from ax-patin
// https://support.mongolab.com
// taken from blog post: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

exports = module.exports

function checkError (error, cb) {
  if (error) {
    console.error(error.toString())
    if (cb) cb(error)
    return true
  }
  return false
}

const _id = 'daniel.lauzon@gmail.com'

function sortByStamp (values, direction) {
  direction = direction || -1
  values.sort(function (a, b) {
    return direction * (Date.parse(a.stamp) - Date.parse(b.stamp))
  })
}

function digest (obj) {
  const data = Buffer.from(JSON.stringify(obj, null, 2))
  return crypto.createHash('md5').update(data).digest('hex')
}

exports.get = async function (cb) { // cb(err,doc)
  try {
    const { ETag, Body } = await s3.getObject({
      Bucket: awsConfig.bucketName,
      Key: awsConfig.keyForSingleObject
    }).promise()
    // both ETag and Body need to be JSON parsed (to validate, and unparse \" in ETag)
    const doc = JSON.parse(Body)
    const digests = {
      ETag: JSON.parse(ETag),
      Document: digest(doc)
    }
    console.log('orm.get', digests)
    cb(null, doc)
  } catch (error) {
    checkError(error, cb)
  }
}

exports.add = function (stamp, value, cb) { // cb(err,doc)
  console.log('orm.add -', stamp, value)
  // Validation - stamp
  if (!stamp) {
    stamp = new Date().toISOString()
  } else {
    var unixStamp = Date.parse(stamp)
    if (isNaN(unixStamp)) {
      checkError(new Error(`orm.add Invalid Date: ${stamp}`), cb)
      return
    }
    var norm = new Date(unixStamp).toISOString()
    stamp = norm
  }
  // Validation - value
  var asNumber = Number(value)
  if (isNaN(asNumber)) {
    checkError(new Error(`orm.add Invalid Value: ${value}`), cb)
    return
  }
  value = Math.round(asNumber * 1000)

  console.log('orm.add +', stamp, value)
  // get append sort save
  exports.get(function (err, doc) {
    if (checkError(err, cb)) return
    doc.values.push({ stamp: stamp, value: value })
    sortByStamp(doc.values)
    exports.save(doc.values, cb)
  })
}

exports.save = async function (values, cb) { // cb(err,doc)
  try {
    const doc = { _id: _id, values: values }
    const data = Buffer.from(JSON.stringify(doc, null, 2))

    const { ETag } = await s3.putObject({
      Bucket: awsConfig.bucketName,
      Key: awsConfig.keyForSingleObject,
      Body: data
    }).promise()
    console.log('orm.save', { ETag: JSON.parse(ETag) })
    cb(null, { ETag })
  } catch (error) {
    checkError(error, cb)
  }
}
