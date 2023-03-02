import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { HEADERS, STATUS_CODES } from "../../constants";
import { DbConnector } from "../data-layer/db-connector";

export const main = async (
    event: APIGatewayProxyEvent & { pathParameters: { productId: string }}
): Promise<APIGatewayProxyResult> => {
    try {
      const { productId } = event.pathParameters;
      const product = await DbConnector.getById(productId);
      const statusCode = product ? STATUS_CODES.SUCCSESS : STATUS_CODES.NOT_FOUND;
      const notFoundMessage = `Error: Can't find product with id ${productId}`;
      const body = product ? JSON.stringify(product) : notFoundMessage;

      return {
        statusCode,
        headers: HEADERS,
        body,
      };
    } catch(e) {
      console.log(e);
      return {
        statusCode: STATUS_CODES.SERVER_ERROR,
        headers: HEADERS,
        body: `The server couldn't process this request: ${e}`,
      };
    }
};
