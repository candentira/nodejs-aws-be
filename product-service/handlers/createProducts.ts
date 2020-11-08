import 'source-map-support/register'
import { createProducts } from './services/productsService'
import { PRODUCT_ERRORS } from './productConsts'

export default async event => {    
  const responseHeaders = { headers: { 'Access-Control-Allow-Origin': '*' } }
  try{
    const { title, description, price, count } = JSON.parse(event.body)
    console.log(`CREATE PRODUCT: ${title}, ${description}, ${price}, ${count}`)
    await createProducts({ title, description, price, count })
    return {
      ...responseHeaders,
      statusCode: 200,
    }
  } catch(err) {
    return {
      ...responseHeaders,
      statusCode: 500,
      body: JSON.stringify(PRODUCT_ERRORS.SERVER_ISSUE)
    }
  }
}