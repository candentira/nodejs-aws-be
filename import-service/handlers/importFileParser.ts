import * as AWS from 'aws-sdk'
import * as csv from 'csv-parser'
const BUCKET = 'hw5-product-files'

export default event => {
    console.log("importFileParser Lambda started execution");

    const s3 = new AWS.S3({ region: 'eu-west-1'})

    event.Records.forEach(record => {
        const objectKey = record.s3.object.key
        const s3Stream = s3.getObject({
            Bucket: BUCKET,
            Key: objectKey
        }).createReadStream();

        s3Stream.pipe(csv())
            .on('data', data => {
                console.log(data)
            })
            .on('end', async () => {
                console.log(`CSV file was parsed`)
                console.log(`Copy from ${BUCKET}/${objectKey}`)

                const newObjectKey = objectKey.replace('uploaded', 'parsed')
                await s3.copyObject({
                    Bucket: BUCKET,
                    CopySource: `${BUCKET}/${objectKey}`,
                    Key: newObjectKey
                }).promise()

                await s3.deleteObject({
                    Bucket: BUCKET,
                    Key: objectKey,
                  }).promise();
                
                console.log(`Copied into ${BUCKET}/${newObjectKey}`)
            })
    })
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: 200
    }
}