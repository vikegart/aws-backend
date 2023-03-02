const PRODUCTS_DB_HOST = process.env.PRODUCTS_DB_HOST;
const PRODUCTS_DB_PORT = process.env.PRODUCTS_DB_PORT || 5432;
const PRODUCTS_DB_USER = process.env.PRODUCTS_DB_USER;
const PRODUCTS_DB_PASSWORD = process.env.PRODUCTS_DB_PASSWORD;
const PRODUCTS_DB_NAME = process.env.PRODUCTS_DB_NAME;

export const config = {
    host: PRODUCTS_DB_HOST,
    port: Number(PRODUCTS_DB_PORT),
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
    database: PRODUCTS_DB_NAME,
};