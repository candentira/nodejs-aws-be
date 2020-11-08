import 'source-map-support/register'
import { createProducts } from './services/productsService'
import { PRODUCT_ERRORS } from './productConsts'

export default async event => {
  console.log("createProducts Lambda started execution");
  console.info("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
  console.log("EVENT\n" + JSON.stringify(event, null, 2));
  
  const responseHeaders = { headers: { 'Access-Control-Allow-Origin': '*' } };
  try{
    const { title, description, price, count } = JSON.parse(event.body);
    console.log(`CREATE PRODUCT: ${title}, ${description}, ${price}, ${count}`);
    await createProducts({ title, description, price, count });
    
    console.info("createProducts Lambda finished execution successfully");

    return {
      ...responseHeaders,
      statusCode: 200,
    }
  } catch(err) {
    console.error("createProducts Lambda failed during execution");
    console.error(err);

    return {
      ...responseHeaders,
      statusCode: 500,
      body: JSON.stringify(PRODUCT_ERRORS.SERVER_ISSUE)
    }
  }
}