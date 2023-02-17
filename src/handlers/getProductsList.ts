import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HEADERS as headers, STATUS_CODES } from "../../constants";
import { DbConnector } from "../data-layer/db-connector";

export const main = async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await DbConnector.getAll();
    return {
      statusCode: STATUS_CODES.SUCCSESS,
      headers,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      statusCode: STATUS_CODES.SERVER_ERROR,
      headers,
      body: `The server couldn't process this request: ${e}`,
    };
  }
};
