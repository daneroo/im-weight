
const { readFileSync } = require('fs')

const region = 'us-east-1'
const bucketName = 'im-weight'
const keyForSingleObject = 'observationdata.json'
const credentialsFile = '../s3/s3-credentials.json'

const config = {
  aws: {
    apiVersion: '2006-03-01',
    region,
    bucketName,
    keyForSingleObject,
    credentials: getCredentials(credentialsFile) // { accessKeyId, secretAccessKey }
  }
}

// AWS/S3 credentials: ENV vars override file values
function getCredentials (credentialsFile) {
  try {
    // Attr Names are different in credentials file (returned from `aws iam create-access-key`)
    const {
      AccessKeyId: accessKeyId,
      SecretAccessKey: secretAccessKey
    } = JSON.parse(readFileSync(credentialsFile))
    // Even if we have the fileURLToPath, environmentCredentials supersedes them
    return {
      accessKeyId: process.env.ACCESS_KEY_ID || accessKeyId,
      secretAccessKey: process.env.SECRET_ACCESS_KEY || secretAccessKey
    }
  } catch (error) {
    return {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
  }
}

console.log(`config: using accessKeyId: ${config.aws.credentials.accessKeyId}`)
module.exports = config
