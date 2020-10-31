import 'source-map-support/register';

let productList

export default async (event, _context) => {
  if (!productList) {
    productList = await import('./productList.json').then(list => productList = list.default )
  }
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(productList),
  };
}