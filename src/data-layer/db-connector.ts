import products from '../../mocks/products'
import { Product } from "../types/api-types";
export const DbConnector = {
    getById: (productId: Product["id"]): Promise<Product | null> => {
        return new Promise((resolve, reject) => {
            const product = products.find(({ id }) => productId === id);
            if (product) {
                resolve(product);
            } else {
                reject(null);
            }
        })
    },
    getAll: (): Promise<Product[]> => {
        return new Promise((resolve, reject) => {
            resolve(products);
        })
    }
}