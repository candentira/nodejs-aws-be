import 'source-map-support/register'
import { getProductsList } from './services/productsService'
import { PRODUCT_ERRORS } from './productConsts'

export default async event => {
  console.log("getProducts Lambda started execution");
  console.info("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  const responseHeaders = { headers: { 'Access-Control-Allow-Origin': '*' } };
  try{
    let productList = await getProductsList();

    console.info("getProducts Lambda finished execution successfully");
    
    return {
      ...responseHeaders,
      statusCode: 200,
      body: JSON.stringify(productList),
    }
  } catch(err) {
    console.error("getProducts Lambda failed during execution");
    console.error(err);
    
    return {
      ...responseHeaders,
      statusCode: 500,
      body: JSON.stringify(PRODUCT_ERRORS.SERVER_ISSUE)
    }
  }
}