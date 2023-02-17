import { main as getProductsList } from "../src/handlers/getProductsList";
import products from "../mocks/products";

test("Should receive all products", async () => {
  const productsJson = JSON.stringify(products);
  const { statusCode, body } = await getProductsList();
  
  expect(statusCode).toBe(200);
  expect(body).toBe(productsJson);
});