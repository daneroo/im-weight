const AWS = require('aws-sdk')
const crypto = require('crypto')
const { readFileSync } = require('fs')
const fs = require('fs').promises

const region = 'us-east-1'
const bucketName = 'im-weight'

const { AccessKeyId: accessKeyId, SecretAccessKey: secretAccessKey } = JSON.parse(readFileSync('./s3-creds.json'))
console.log({
  accessKeyId,
  secretAccessKey
})

const config = {
  apiVersion: '2006-03-01',
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}

// Create S3 service object
const s3 = new AWS.S3(config)

doit()

async function doit () {
  try {
    // Call S3 to list the buckets
    // const { Buckets } = await s3.listBuckets().promise()
    // console.log('Success', Buckets)

    // const cb = await s3.createBucket({ Bucket: bucketName }).promise()
    // console.log('Created Bucket:', cb)

    const content = await fs.readFile('../observationdata.json', 'utf8')
    const obj = JSON.parse(content)
    const data = Buffer.from(JSON.stringify(obj, null, 2))

    // const data = await fs.readFile('../observationdata.json', 'binary')

    {
      const start = +new Date()
      const digest = crypto.createHash('md5').update(data).digest('hex')
      console.log(`digest:${+new Date() - start}`, { digest })
    }

    {
      const start = +new Date()
      const uf = await s3.upload({
        Bucket: bucketName,
        Key: 'observationdata.json',
        Body: data
      }).promise()

      const { ETag } = uf
      console.log(`upload:${+new Date() - start}`, { ETag })
    }
    {
      const start = +new Date()
      const po = await s3.putObject({
        Bucket: bucketName,
        Key: 'observationdata.json',
        Body: data
      }).promise()
      console.log(`putObject:${+new Date() - start}`, po)
    }

    // const lo = await s3.listObjects({ Bucket: bucketName }).promise()
    // console.log('List Objects:', lo)
    {
      const start = +new Date()
      const go = await s3.getObject({
        Bucket: bucketName,
        Key: 'observationdata.json'
      }).promise()
      const { ETag } = go
      const digest = crypto.createHash('md5').update(go.Body).digest('hex')
      console.log(`getObject:${+new Date() - start}`, { ETag, digest })
    }
  } catch (error) {
    console.error(error)
  }
}
