import * as AWS from 'aws-sdk'
const BUCKET = 'hw5-product-files'

export default event => {
    const { name } = event.queryStringParameters
    const path = `uploaded/${name}`
    const s3 = new AWS.S3({ region: 'eu-west-1'})
    const params = {
        Bucket: BUCKET,
        Key: path,
        Expires: 60,
        ContentType: 'application/vnd.ms-excel'
    }

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (error, url) => {
            if (error) {
                reject(error)
            }
            resolve({
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: url
            })
        })
    })
}