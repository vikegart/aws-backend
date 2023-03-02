import * as AWSMock from "aws-sdk-mock";
import {AWSInstance, main as importProductsFile} from "../src/handlers/importProductsFile";

const MOCKED_NAME = 'products.csv';
AWSMock.setSDKInstance(AWSInstance);
AWSMock.mock('S3', 'getSignedUrl', `http://my-awsome-bucket.com/uploaded/${MOCKED_NAME}`);
test("Should upload file to S3 and return signed url", async () => {
  const mockEvent = {
    queryStringParameters: {
      name: MOCKED_NAME,
    },
  };
  const expectedUrl = `http://my-awsome-bucket.com/uploaded/${mockEvent.queryStringParameters.name}`;

  const { statusCode, body } = await importProductsFile(mockEvent);

  expect(statusCode).toBe(200);
  expect(body).toBe(JSON.stringify({signedUrl: expectedUrl}));
});

test("Should receive statusCode 500 if queryStringParameters === undefined ", async () => {
  const { statusCode } = await importProductsFile({});

  expect(statusCode).toBe(500);
});

test("Should receive statusCode 500 if queryStringParameter name === undefined ", async () => {
  const mockEvent = {
    queryStringParameters: {},
  };
  const { statusCode } = await importProductsFile(mockEvent);

  expect(statusCode).toBe(500);
});

