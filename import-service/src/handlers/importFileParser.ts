import * as AWS from 'aws-sdk';

import {APIGatewayProxyResult, S3Event} from "aws-lambda";
import { HEADERS as headers, STATUS_CODES } from "../../constants";
import {parseCsvStreamData} from "../utils/parseCsvStreamData";
import { config } from "../utils/getBucketConfig";
const { bucketName } = config;

export const main = async (event: S3Event): Promise<APIGatewayProxyResult> => {
  try {
    const s3 = new AWS.S3({ region: process.env.REGION });
    for (const record of event.Records) {
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const params = {
        Bucket: bucketName,
        Key: key
      }
      const s3Stream = s3.getObject(params).createReadStream();
      parseCsvStreamData(s3Stream);
      await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace('uploaded', 'parsed')
      }).promise();

      await s3
          .deleteObject({ Bucket: bucketName, Key: key })
          .promise();
    }
    return {
      statusCode: STATUS_CODES.SUCCSESS,
      headers,
      body: 'PARSED',
    }
  } catch (e) {
    return {
      statusCode: STATUS_CODES.SERVER_ERROR,
      headers,
      body: `The service file-parser couldn't parse: ${e}`,
    };
  }
};
