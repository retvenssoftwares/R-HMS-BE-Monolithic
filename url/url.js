require("dotenv").config()
const AWS = require('aws-sdk');
// Configure AWS SDK with Amazon s3 Spaces credentials

// Configure AWS

// Configure AWS SDK with DigitalOcean Spaces credentials
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
});
module.exports = s3;