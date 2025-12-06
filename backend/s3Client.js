// backend/s3Client.js
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  // If using IAM role on EC2, you can omit accessKeyId/secretAccessKey
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

module.exports = {
  s3,
  BUCKET_NAME,
};
