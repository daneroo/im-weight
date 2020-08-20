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

// const _id = 'daniel.lauzon@gmail.com'

// function sortByStamp (values, direction) {
//   direction = direction || -1
//   values.sort(function (a, b) {
//     return direction * (Date.parse(a.stamp) - Date.parse(b.stamp))
//   })
// }

function digest (obj) {
  const data = Buffer.from(JSON.stringify(obj, null, 2))
  return crypto.createHash('md5').update(data).digest('hex')
}

// return document or throws
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

export default async function (req, res) {
  const { url, method } = req

  try {
    switch (method) {
      case 'GET':
      // Get data from your database
        console.log('server', { url, method })
        res.json(await get())
        break
      case 'POST':
        res.json({ implemented: 'not yet' })
        // const { body: { value, stamp } } = req
        // console.log('server', { url, method, value, stamp })

        // const { data } = await axios.post(PROXY_POST, { value, stamp })
        // res.json(data)
        break
      default:
        console.log('server', { url, method })
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({ error: `Method ${method} Not Allowed` })
    }
  } catch (error) {
    res.status(502).json({ error: error.toString() })
  }
}
