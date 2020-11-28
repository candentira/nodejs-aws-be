import { Client } from 'pg'

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
};

export const getProductsList = async () => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const queryStr = `select id, title, description, price, count from products p INNER JOIN stocks s on p.id = s.product_id`
    const { rows: products } = await client.query(queryStr);
    return products;
  } catch (err) {
      // you can process error here. In this example just log it to console.
      console.error('Error during database request executing:', err);
  } finally {
      // in case if error was occurred, connection will not close automatically
      client.end(); // manual closing of connection
  }
}

export const getProductsById = async id => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const queryStr = `select id, title, description, price, count from products p INNER JOIN stocks s on p.id = s.product_id where p.id = $1`
    const { rows: products } = await client.query(queryStr, [id]);
    return products && products.length === 1 ? products[0] : products;
  } catch (err) {
      console.error('Error during getProductsById database request:', err);
  } finally {
      client.end();
  }
}

export const getProductsByTitle = async title => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const queryStr = `select id, title, description, price from products where products.title = $1`
    const { rows: products } = await client.query(queryStr, [title]);
    return products;
  } catch (err) {
      console.error('Error during getProductsByTitle database request:', err);
  } finally {
      client.end();
  }
}

export const isValidProduct = ({ title, description, price, count }) => {
  return title && description && price && count &&
      typeof price === 'number' && typeof title === 'string' && typeof description === 'string'
}

export const createProduct = async ({ title, description, price, count }) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    await client.query('BEGIN');
    const createProductQuery = `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id`
    const result = await client.query(createProductQuery, [title, description, price]) ;
    const productId = result.rows[0].id;
    await client.query(`INSERT INTO stocks (product_id, count) VALUES ($1, $2)`, [productId, count]);
    await client.query('COMMIT');
    return await getProductsById(productId);
  } catch (err) {
      console.error('Error during database request executing:', err);
      await client.query('ROLLBACK');
      throw err;
  } finally {
      client.end()
  }
}
