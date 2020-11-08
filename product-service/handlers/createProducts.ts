import 'source-map-support/register'
import { createProducts } from './services/productsService'

export default async event => {
  const { title, description, price, count } = JSON.parse(event.body)
  console.log(`CREATE PRODUCT: ${title}, ${description}, ${price}, ${count}`)
  await createProducts({ title, description, price, count })
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
  }
}