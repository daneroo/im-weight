
const crypto = require('crypto')
const AWS = require('aws-sdk')
var mongo = require('mongodb')
var MongoClient = mongo.MongoClient

// Get our config with credentials
const { aws: awsConfig } = require('../config')
// Create S3 service object
const s3 = new AWS.S3(awsConfig)

// Taken from ax-patin
// https://support.mongolab.com
// taken from blog post: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/weight' // default to local docker see README for docker instruction

// var collectionName = 'entries'
let db = null // persisted db connection object

MongoClient.connect(mongoUri, function (err, _db) {
  // if error we will never work...
  if (err) {
    console.log('Error Connecting to', mongoUri, err)
    return
  }
  console.log('Connected to', mongoUri)
  // Save the db reference
  db = _db
})

exports = module.exports

function checkError (error, cb) {
  if (error) {
    console.error(error.message)
    if (cb) cb(error)
    return true
  }
  return false
}

const collectionName = 'observations'
const _id = 'daniel.lauzon@gmail.com'
function getCollection (cb) { // cb(err,conn)
  db.collection(collectionName, function (err, coll) {
    if (checkError(err, cb)) return
    if (cb) cb(err, coll)
  })
}

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

exports.get = function (cb) { // cb(err,doc)
  console.log('orm.get')
  getCollection(function (err, coll) {
    if (checkError(err, cb)) return
    coll.find({ _id: _id }, function (err, cursor) {
      if (checkError(err, cb)) return

      // this callback is async to accommodate S3 integration
      cursor.toArray(async function (err, docs) {
        if (checkError(err, cb)) return

        if (docs.length === 0) {
          // FIX: allow first document creation for now
          // cb({message:'document not found'});
          cb(null, {
            _id: 'daniel.lauzon@gmail.com',
            values: []
          })
          return
        }

        if (docs.length > 1) {
          console.warn('|find(_id)|>1', _id, docs.length)
        }

        try {
          const go = await s3.getObject({
            Bucket: awsConfig.bucketName,
            Key: awsConfig.keyForSingleObject
          }).promise()
          const { ETag, Body } = go
          const digests = {
            mongo: digest(docs[0]),
            ETag: JSON.parse(ETag),
            s3: digest(JSON.parse(Body))
          }
          console.log('happyGet', digests)
        } catch (error) {
          console.error(error.toString())
        }
        cb(null, docs[0])
      })
    })
  })
}

exports.add = function (stamp, value, cb) { // cb(err,doc)
  console.log('orm.add -', stamp, value)
  if (!stamp) {
    stamp = new Date().toISOString()
  } else {
    var unixStamp = Date.parse(stamp)
    if (isNaN(unixStamp)) {
      console.error('orm.add Invalid Date', stamp)
      if (cb) cb(new Error(`Invalid Date: ${stamp}`))
      return
    }
    var norm = new Date(unixStamp).toISOString()
    stamp = norm
  }
  // if value not numeric...
  var asNumber = Number(value)
  if (isNaN(asNumber)) {
    console.error('orm.add Invalid Value', value)
    if (cb) cb(new Error(`Invalid Value: ${value}`))
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

exports.save = function (values, cb) { // cb(err,doc)
  console.log('orm.save')
  getCollection(function (err, coll) {
    if (checkError(err, cb)) return

    /* Simple object to insert: ip address and date */
    var doc = { _id: _id, values: values }

    /* Insert the object then print in response */
    /* Note the _id has been created */
    coll.save(doc, { safe: true }, function (err) {
      if (checkError(err, cb)) return

      // could return the _id or something
      if (cb) cb(null, null)
    }) // save
  }) // collection
}
