import 'source-map-support/register'
import { getProductsById } from './services/productsService'
import { PRODUCT_ERRORS } from './productConsts'

export default async event => {
  console.log("getProductsById Lambda started execution");
  console.info("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  const responseHeaders = { headers: { 'Access-Control-Allow-Origin': '*' } }
  try {
    const { id } = event.pathParameters
    if (!id) {    
      return { ...responseHeaders,
        statusCode: 400,
        body: JSON.stringify(PRODUCT_ERRORS.ID_NOT_PROVIDED),
      };
    }

    const product = await getProductsById(id)

    console.info("getProductsById Lambda finished execution successfully");
    
    if (!product || product.length === 0) {
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
    console.error("getProductsById Lambda failed during execution");
    console.error(err)    
    
    return { ...responseHeaders,
      statusCode: 500,
      body: JSON.stringify(PRODUCT_ERRORS.SERVER_ISSUE),
    };
  }
}

