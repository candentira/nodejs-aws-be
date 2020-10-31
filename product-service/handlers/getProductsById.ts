import 'source-map-support/register';

let productList

export default async (event, _context) => {
  const { id } = event.pathParameters
  if (!productList) {
    productList = await import('./productList.json').then(list => list.default )
  }
  const products = productList.filter(product => product.id === id)
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(products),
  };
}

