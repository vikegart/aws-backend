const IMPORT_SERVICE_REGION = process.env.REGION || 'eu-west-1';
const IMPORT_SERVICE_BUCKET = process.env.BUCKET;

export const config = {
    region: IMPORT_SERVICE_REGION,
    bucketName: IMPORT_SERVICE_BUCKET,
};