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
