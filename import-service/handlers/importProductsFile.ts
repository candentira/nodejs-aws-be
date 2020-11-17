import { S3 } from 'aws-sdk'
const BUCKET = 'hw5-product-files'

export default event => {
    console.log("importProductsFile Lambda started execution");
    console.log("EVENT\n" + JSON.stringify(event, null, 2));

    const { name } = event.queryStringParameters
    const path = `uploaded/${name}`
    const s3 = new S3({ region: 'eu-west-1'})
    const params = {
        Bucket: BUCKET,
        Key: path,
        Expires: 60,
        ContentType: 'text/csv'
    }

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (error, url) => {
            if (error) {
                reject(error)
                return
            }
            resolve({
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: url
            })
        })
    })
}