import { SNS } from 'aws-sdk'
import { createProduct, getProductsByTitle, isValidProduct } from './services/productsService'

const sendProductCreatedNotification = (sns, product) => {
    console.log('Sending product created notification to SNS Topic')
    sns.publish({
        Subject: `NodeJS in AWS training: Product ${product.title} was created`,
        Message: `NodeJS in AWS training: Product ${JSON.stringify(product)} was created in DB`,
        MessageAttributes: {
            productCount: {
                DataType: 'Number',
                StringValue: product.count.toString(),
            },
        },
        TopicArn: process.env.SNS_ARN 
    }, (error, data) => {        
        if (error) {
            console.log(`Couldn't send product to SNS, error: ${error}`)
        } else {
            console.log(`Send message to SNS with product created: ${JSON.stringify(data)}`)
        }
    })
}

export default async event => {
    console.log("catalogBatchProcess Lambda started execution");
    console.log("EVENT\n" + JSON.stringify(event, null, 2));

    const sns = new SNS({ region: 'eu-west-1'})
    return Promise.all(event.Records.map(async ({ body }) => {
        console.log(`Start Product creation: ${JSON.stringify(body)}`)
        const { title, description, price, count } = JSON.parse(body)
        const productData = { title, description, price: +price, count: +count }
        if (!isValidProduct(productData)) {
            console.log('Wrong product data. Aborting product creation.')
            return
        }
        const productAlreadyExists = await getProductsByTitle(productData.title)
        if (productAlreadyExists && productAlreadyExists.length) {
            console.log('Trying to create product with existing title. Aborting product creation.')
            return
        }
        try {
            const createdProduct = await createProduct(productData)
            console.log(`Product was created: ${JSON.stringify(createdProduct)}`)
            sendProductCreatedNotification(sns, createdProduct)
        } catch(err) {
            console.log(`Product wasn't created`)
            console.error(err)
        }
    }))
}
