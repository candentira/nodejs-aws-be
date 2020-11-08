import 'source-map-support/register'
import { getProductsList } from './services/productsService'

export default async event => {
  let productList = await getProductsList()
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(productList),
  }
}