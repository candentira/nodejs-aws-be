import 'source-map-support/register';
import productList from './productList.json'

// Lazy loading only to show that async await would be used in this lambda
// const productGetter = () => {
//   let products
//   return async () => {
//     if (!products) {
//       products = await import('./productList.json').then(list => list.default )
//     }
//     return products
//   }
// }
// const getProducts = productGetter()

export default async (event, _context) => {
  //const productList = await getProducts()
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(productList),
  }
}