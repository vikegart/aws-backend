import { Product } from "../types/api-types";
import { Client } from "pg";
import { config } from "../utils/getDBClientConfig";

export const DbConnector = {
    getById: (productId: Product["id"]): Promise<Product | null> => {
        const client = new Client({
            ...config,
        });
        return new Promise(async (resolve, reject) => {
            try {
                await client.connect();
                console.log(`Fetching product with id ${productId}`);
                const getProductQuery =
                    "SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id WHERE products.id=$1";
                const {rows: products} = await client.query(getProductQuery, [productId]);
                const product:Product = products.pop();
                resolve(product ? product : null);
            } catch (e) {
                const errorMessage = e.message || e;
                console.error("ERROR: Can't fetch the product:", errorMessage);
                reject(errorMessage);
                await client.query("ROLLBACK");
            } finally {
                await client.end();
                console.log(`Connection to the DB was closed`);
            }
        })
    },
    getAll: (): Promise<Product[]> => {
        const client = new Client({
            ...config,
        });
        return new Promise(async (resolve, reject) => {
            try {
                await client.connect();
                console.log(`Getting all products`);
                const getProductsQuery =
                    "SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id";
                const { rows: products } = await client.query(getProductsQuery);

                console.log("Products were successfully fetched");
                resolve(products);
            } catch (e) {
                const errorMessage = e.message || e;
                console.error("ERROR: can't fetch all products:", errorMessage);
                reject(errorMessage);
                await client.query("ROLLBACK");
            } finally {
                await client.end();
                console.log(`Connection to the DB was closed`);
            }
        })
    },
    createProduct: (product: Product): Promise<Product['id']> => {
        const client = new Client({
            ...config,
        });
        return new Promise(async (resolve, reject) => {
            try {
                await client.connect();
                console.log(`Creating product with id ${product.id}`);
                await client.query("BEGIN");
                const insertProductQuery =
                    "INSERT INTO products(id, title, description, price) VALUES($1, $2, $3, $4)";
                await client.query(insertProductQuery, [product.id, product.title, product.description, product.price]);

                const insertStockQuery =
                    "INSERT INTO stocks(product_id, count) VALUES($1, $2)";
                await client.query(insertStockQuery, [product.id, product.count]);

                await client.query("COMMIT");

                console.log(`Product with id ${product.id} was successfully added`);
                resolve(product.id);
            } catch (e) {
                const errorMessage = e.message || e;
                console.error("ERROR: Product wasn't added:", errorMessage);
                reject(errorMessage);
                await client.query("ROLLBACK");
            } finally {
                await client.end();
                console.log(`Connection to the DB was closed`);
            }
        })
    },
}