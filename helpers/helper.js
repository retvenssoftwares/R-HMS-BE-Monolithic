import * as dotenv from "dotenv";
dotenv.config();
import * as crypto from "crypto";
import s3 from "../utils/url.js";
import jwt from "jsonwebtoken";

//function to upload single image ot s3 spaces
const bucket = process.env.bucket;
async function uploadImageToS3(file) {
  const params = {
    Bucket: bucket, // Replace with your S3 bucket name
    Key: `hotel_images/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  // const uploadResponse = await s3.upload(params).promise();
  // const imageUrl = uploadResponse.Location;
  const [uploadResponse] = await Promise.all([s3.upload(params).promise()]);
  const imageUrl = uploadResponse.Location;

  return imageUrl;
}

async function uploadMultipleImagesToS3(files) {
  const uploadPromises = files.map((file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket: bucket, // Replace with your S3 bucket name
          Key: `hotel_images/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        const [uploadResponse] = await Promise.all([
          s3.upload(params).promise(),
        ]);
        const imageUrl = uploadResponse.Location;

        resolve(imageUrl);
      } catch (error) {
        reject(error);
      }
    });
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    throw error;
  }
}

//function to get utc time
async function getCurrentUTCTimestamp() {
  const now = new Date();
  const utcTimestamp = now.toISOString(); // Convert to ISO string
  return utcTimestamp;
}

function getCurrentLocalTimestamp() {
  const localTimestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  return localTimestamp;
}

// Verify the token\
async function jwtTokenVerify(token) {
  jwt.verify(token, process.env.jwtsecretkey, (err, decoded) => {
    if (err) {
      // Token verification failed
      console.error("Token verification failed:", err.message);
      // Handle authentication failure here
    } else {
      // Token is valid, and `decoded` contains the payload data
      console.log("Token verified. User data:", decoded);

      // You can use `decoded` to extract user information or perform other actions.
      // For example, if you stored user ID in the payload, you can access it like this:
      // const userId = decoded.userId;

      // Handle authentication success here
    }
  });
}

// Function to encrypt text
const key = process.env.key;
const iv = process.env.iv;
function encrypt(text) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv)
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Function to decrypt text
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv)
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function jwtsign(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.jwtsecretkey, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

export {
  getCurrentUTCTimestamp,
  uploadImageToS3,
  jwtTokenVerify,
  jwtsign,
  uploadMultipleImagesToS3,
  getCurrentLocalTimestamp,
  decrypt,
  encrypt,
};
