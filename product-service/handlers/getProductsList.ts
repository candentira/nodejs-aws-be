import 'source-map-support/register'
import { getProductsList } from './services/productsService'
import { PRODUCT_ERRORS } from './productConsts'

export default async event => {
  const responseHeaders = { headers: { 'Access-Control-Allow-Origin': '*' } }
  try{
    let productList = await getProductsList()
    return {
      ...responseHeaders,
      statusCode: 200,
      body: JSON.stringify(productList),
    }
  } catch(err) {
    return {
      ...responseHeaders,
      statusCode: 500,
      body: JSON.stringify(PRODUCT_ERRORS.SERVER_ISSUE)
    }
  }
}