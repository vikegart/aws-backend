import pkg from 'pg';
import products from '../mocks/products';
import { config } from "../src/utils/getDBClientConfig";
const { Client } = pkg;

const client = new Client({
    ...config
});

(async () => {
    try {
        await client.connect();
        console.log(`Successful connection to the DB`);

        for (const product of products) {
            const { title, price, description, id, count } = product;

            try {
                console.log(`Starting transaction for product id ${id}...`);
                await client.query("BEGIN");

                const insertProductQuery =
                    "INSERT INTO products(id, title, description, price) VALUES($1, $2, $3, $4)";
                await client.query(insertProductQuery, [id, title, description, price]);

                const insertStockQuery =
                    "INSERT INTO stocks(product_id, count) VALUES($1, $2)";
                await client.query(insertStockQuery, [id, count]);

                await client.query("COMMIT");
                console.log(`Product with id ${id} was successfully added`);
            } catch (e) {
                await client.query("ROLLBACK");
                console.error(`ERROR: Product with id ${id} wasn't added`, e.message);
            }
        }
    } catch (e) {
        console.error(
            `ERROR: Can't connect to the DB`,
            e.message
        );
    } finally {
        client.end();
        console.log(`Connection to the DB was closed`);
    }
})();