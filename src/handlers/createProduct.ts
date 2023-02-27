import { v4 as uuidv4 } from "uuid";

import {HEADERS as headers, STATUS_CODES} from "../../constants";
import {DbConnector} from "../data-layer/db-connector";
import {APIGatewayProxyResult} from "aws-lambda";

const validateProductCreationInput = (description, count, title, price) => {
    const areAllArgumentsPresent = description && count && title && price;
    if (!areAllArgumentsPresent) throw Error('Not all required arguments were provided (title, description, price, count)');
};

export const main = async (event): Promise<APIGatewayProxyResult> => {
    try {
        const { description, count, title, price } = JSON.parse(event.body);
        const id = uuidv4();
        validateProductCreationInput(description, count, title, price);
        const productId = await DbConnector.createProduct({description, count, title, price, id});

        return {
            statusCode: STATUS_CODES.SUCCSESS,
            headers,
            body: productId,
        };

    } catch (e) {
        console.log(e);
        return {
            statusCode: STATUS_CODES.SERVER_ERROR,
            headers,
            body: `The server couldn't process this request: ${e}`,
        };
    }
};