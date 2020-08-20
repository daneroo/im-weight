import crypto from 'crypto'
import AWS from 'aws-sdk'

// ----- CONFIG -----
// get config from environment, and other constant configs
// move to own module when re-used elsewhere
const config = {
  aws: {
    region: 'us-east-1',
    bucketName: 'im-weight',
    keyForSingleObject: 'observationdata.json',
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
  }
}
// ------------------

// Get our config with credentials
const { aws: awsConfig } = config

// Create S3 service object
const s3 = new AWS.S3(awsConfig)

const _id = 'daniel.lauzon@gmail.com'

function digest (obj) {
  const data = Buffer.from(JSON.stringify(obj, null, 2))
  return crypto.createHash('md5').update(data).digest('hex')
}

// Returns {ETag} - or throws
async function head () {
  const { ETag: ETagJSON } = await s3.headObject({
    Bucket: awsConfig.bucketName,
    Key: awsConfig.keyForSingleObject
  }).promise()
  // ETag needs to be JSON parsed (to validate, and unparse \" in ETag)
  const ETag = JSON.parse(ETagJSON)
  console.log('orm.head', JSON.stringify({ ETag }))
  return { ETag }
}

// get: returns document {_id,values} or throws
// Could also return {doc,digests:{ETag,(==) Document}}
async function get () {
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
  console.log('orm.get', JSON.stringify(digests))
  return doc
}

// Add a scaled value to S3
// -Get the array from S3
// -Add {value: Math.round(value*100),stamp}
// -Call save (which sorts the array)
async function add ({ value, stamp }) {
  console.log('orm.add -', stamp, value)
  // Validation - stamp
  stamp = validateAndNormalizeStamp(stamp)

  // Validation - value
  value = validateAndScaleValue(value)

  console.log('orm.add +', stamp, value)

  // get, append, save
  const { values } = await get()

  const { ETag } = await save([...values, { value, stamp }])
  return { ETag }

  function validateAndScaleValue (value) {
    var asNumber = Number(value)
    if (isNaN(asNumber)) {
      throw new Error(`orm.add Invalid Value: ${value}`)
    }
    // scale and round the result (we store integers)
    return Math.round(asNumber * 1000)
  }

  // default value: now - throws if invalid
  function validateAndNormalizeStamp (stamp) {
    //  default parameter does not work if stamp===null
    stamp = stamp || new Date().toISOString()
    const unixStamp = Date.parse(stamp)
    if (isNaN(unixStamp)) {
      throw new Error(`orm.add Invalid Date: ${stamp}`)
    }
    return new Date(unixStamp).toISOString()
  }
}

// Sort the values and Save to S3
// Returns {ETag}
async function save (values) {
  // sort the values (most recent first)
  values = values.slice().sort(stampCompare())

  const doc = { _id, values }
  const data = Buffer.from(JSON.stringify(doc, null, 2))

  const { ETag } = await s3.putObject({
    Bucket: awsConfig.bucketName,
    Key: awsConfig.keyForSingleObject,
    Body: data
  }).promise()

  //  ETag is JSON encoded. i.e. wrapped in extra ""
  console.log('orm.save', { ETag: JSON.parse(ETag) })
  return { ETag }

  // returns a compare function (default direction:-1 i.e. most recent first)
  function stampCompare (direction = -1) {
    return function (a, b) {
      return direction * (Date.parse(a.stamp) - Date.parse(b.stamp))
    }
  }
}

export default async function (req, res) {
  const { url, method } = req

  try {
    switch (method) {
      case 'GET': {
        const { query: { digest } } = req
        console.log('server', { url, method, digest })
        if (digest !== undefined) {
          res.json(await head())
        } else {
          res.json(await get())
        }
        break
      }
      case 'POST': {
        // res.json({ implemented: 'not yet' })
        const { body: { value, stamp } } = req
        console.log('server', { url, method, value, stamp })

        res.json(await add({ value, stamp }))

        break
      }
      default:
        console.log('server', { url, method })
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({ error: `Method ${method} Not Allowed` })
    }
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: error.message })
  }
}
