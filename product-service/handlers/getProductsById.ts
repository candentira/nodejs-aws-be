import 'source-map-support/register'
import productList from './productList.json'
import { PRODUCT_ERRORS } from './productConsts'

// Lazy loading only to show that async await would be used in this lambda
// const productGetter = () => {
//   let products
//   return async () => {
//     if (!products) {
//       //products = await import('./productList.json').then(list => list.default )
//       throw Error('WOW Error')
//     }
//     return products
//   }
// }
// const getProducts = productGetter()

export default async event => {
  const responseHeaders = { headers: { 'Access-Control-Allow-Origin': '*' } }
  try {
    // const productList = await getProducts()
    const { id } = event.pathParameters
    if (!id) {    
      return { ...responseHeaders,
        statusCode: 400,
        body: JSON.stringify(PRODUCT_ERRORS.ID_NOT_PROVIDED),
      };
    }
    const product = productList.find(product => product.id === id)
    if (!product) {
      return { ...responseHeaders,
        statusCode: 404,
        body: JSON.stringify(PRODUCT_ERRORS.NOT_FOUND),
      };
    }
    return { ...responseHeaders,
      statusCode: 200,
      body: JSON.stringify(product),
    }
  } catch(err) {
    console.error(err)    
    return { ...responseHeaders,
      statusCode: 500,
      body: JSON.stringify(PRODUCT_ERRORS.SERVER_ISSUE),
    };
  }
}

