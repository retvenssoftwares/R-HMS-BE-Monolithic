import * as dotenv from 'dotenv';
dotenv.config();
import pkg from 'aws-sdk';
const { Endpoint, S3 } = pkg;
// Configure AWS SDK with DigitalOcean Spaces credentials
const endpoint = process.env.endpoint
const spacesEndpoint = new Endpoint(endpoint);
const s3 = new S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
});
export default s3;