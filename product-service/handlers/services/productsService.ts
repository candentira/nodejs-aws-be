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
    const { rows: products } = await client.query(`select id, title, description, price, count from products p INNER JOIN stocks s on p.id = s.product_id`);
    console.log(products);
    return products;
  } catch (err) {
      // you can process error here. In this example just log it to console.
      console.error('Error during database request executing:', err);
  } finally {
      // in case if error was occurred, connection will not close automatically
      client.end(); // manual closing of connection
  }
}

export const createProducts = async ({ title, description, price, count }) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query(`INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id`, [title, description, price]) ;
    await client.query(`INSERT INTO stocks (product_id, count) VALUES ($1, $2)`, [result.rows[0].id, count]);
    await client.query('COMMIT');
  } catch (err) {
      console.error('Error during database request executing:', err);
      await client.query('ROLLBACK');
      throw err;
  } finally {
      client.end()
  }
}
