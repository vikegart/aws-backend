import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { HEADERS as headers, STATUS_CODES } from "../../constants";

import { config } from "../utils/getBucketConfig";
const { region, bucketName } = config;

//this export is required only for unit tests
export const AWSInstance = AWS;
export const main = async (
    event: { queryStringParameters: { name: string } } & APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const s3 = new AWS.S3({ region });
        const { name } = event.queryStringParameters;
        if (!name) {
            throw Error(`query param 'name' isn't specified`);
        }
        const params = {
            Bucket: bucketName,
            Key: `uploaded/${name}`,
            Expires: 60,
            ContentType: 'text/csv'
        }
        const result = await s3.getSignedUrlPromise('putObject', params);
        return {
            statusCode: STATUS_CODES.SUCCSESS,
            headers,
            body: JSON.stringify({signedUrl: result}),
        };
    } catch(e) {
      console.log(e);
      return {
        statusCode: STATUS_CODES.SERVER_ERROR,
        headers,
        body: `The server couldn't process this request: ${e}`,
      };
    }
};
