import 'source-map-support/register';

import getProductsList from './handlers/getProductsList'
import getProductsById from './handlers/getProductsById'
import createProducts from './handlers/createProducts'
import catalogBatchProcess  from './handlers/catalogBatchProcess'
  
export { getProductsList, getProductsById, createProducts, catalogBatchProcess }
