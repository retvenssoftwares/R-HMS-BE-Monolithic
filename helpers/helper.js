import * as dotenv from "dotenv";
dotenv.config();
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import * as crypto from 'crypto';
import s3 from "../utils/url.js"
import jwt from "jsonwebtoken";
import verifiedUser from "../models/verifiedUsers.js";
import property from "../models/property.js";
import sgMail from '@sendgrid/mail';


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

  const uploadPromise = s3.upload(params).promise();
  const uploadResponse = await uploadPromise;
  const imageUrl = uploadResponse.Location;

  return imageUrl;
}

// Create a helper function
async function findUserByUserIdAndToken(userId, token) {
  try {
    // Find the user by userId
    const user = await verifiedUser.findOne({ userId }).lean();

    // console.log("user",user)

    if (!user) {
      return { success: false, message: "User not found or invalid userId", statuscode: 400 };
    }

    // Check if the token exists in the token array
    const tokenExists = user.token.some((userToken) => userToken.token === token);

    if (tokenExists) {
      return { success: true, user: user };
    } else {
      return { success: false, message: "Invalid authentication token", statuscode: 400 };
    }
  } catch (error) {
    // Handle errors here
    console.error('Error finding user:', error);
    throw error;
  }
}

//function to validte propertyId
async function validateHotelCode(userId, hotelCode) {
  try {
    const findUser = await verifiedUser.findOne({ userId: userId });
    if (!findUser) {
      return { success: false, message: "User not found or invalid userId", statuscode: 400 };
    }
    const hotelCodeExists = findUser.hotelCode.some((hotelcode) => hotelcode.hotelCode === hotelCode);
    if (hotelCodeExists) {
      return { success: true, user: findUser };
    } else {
      return { success: false, message: "Invalid hotel code", statuscode: 400 };
    }
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

async function uploadMultipleImagesToS3(files) {
  const uploadPromises = files.map(async (file) => {
    const params = {
      Bucket: bucket, // Replace with your S3 bucket name
      Key: `hotel_images/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const uploadResponse = await s3.upload(params).promise();
      const imageUrl = uploadResponse.Location;
      return imageUrl;
    } catch (error) {
      throw error; // You can handle the error at a higher level
    }
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  }
}


//function to convert into iso format date
function convertToISODate(dateString) {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1] - 1; // Months in JavaScript are zero-indexed (0-11)
    const year = parts[2];
    return new Date(year, month, day).toISOString();
  }
  return null; // Handle invalid date string
}

//function to get utc time
async function getCurrentUTCTimestamp() {
  const now = new Date();
  const utcTimestamp = now.toISOString(); // Convert to ISO string
  return utcTimestamp;
}

function getDatesBetweenDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
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
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
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


function convertTimestampToCustomFormat(utcTimestamp, targetTimeZone) {
  // Convert the UTC timestamp to the target time zone
  const zonedTimestamp = utcToZonedTime(utcTimestamp, targetTimeZone);

  // Define the custom format
  const customFormat = "yyyy-MM-dd HH:mm:ss";

  // Format the zoned timestamp into the custom format
  const formattedTimestamp = format(zonedTimestamp, customFormat, {
    timeZone: targetTimeZone,
  });

  return formattedTimestamp;
}

///
// function getLocalizedResponse(language, translations) {
//   // Default to English if the specified language is not found.
//   const selectedLanguage = translations[language] || translations.en;

//   // Build and return the response object for the specified language.
//   return selectedLanguage
// }




//

function generateFourDigitRandomNumber() {
  return new Promise((resolve, reject) => {
    try {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);

      resolve(randomNumber);
    } catch (error) {
      reject(error);
    }
  });
}




// generate username
function generateUserName(firstName, phoneNumber) {
  return new Promise((resolve, reject) => {
    try {
      const data = firstName.split(",")
      const phone = phoneNumber.split(",")
      const randomNumber = data[0].slice(0, 3) + phone[phone.length - 1].slice(-3);
      resolve(randomNumber);
    } catch (error) {
      reject(error);
    }
  });
}



/// random string
function generateString() {
  return new Promise((resolve, reject) => {
    try {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let randomString = '';

      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }

      resolve(randomString);
    } catch (error) {
      reject(error);
    }
  });
}


const verifyUser = async (userId, authCodeValue) => {
  try {
    const findUser = await verifiedUser.findOne({ userId });

    if (!findUser) {
      return { success: false, message: "User not found or invalid userId", statuscode: 400 };
    }

    const userToken = findUser.authCode;

    if (authCodeValue !== userToken) {
      return { success: false, message: "Invalid authentication token", statuscode: 400 };
    }

    return { success: true, user: findUser };
  } catch (error) {
    console.log(error)
    return { success: false, message: "Internal Server Error", statuscode: 500 };
  }



};




sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (username, hotelcode, hotelRcode, email) => {
  let msg;

  if (hotelRcode) {
    msg = {
      to: `${email}`, // Change to your recipient
      from: 'retvenssoftwares@gmail.com', // Change to your verified sender
      templateId: process.env.template_ID2,
      dynamicTemplateData: {
        username: username,
        text_here_2: hotelRcode,
      },
    };
  }
 

  if (hotelRcode && hotelcode !== "") {
    console.log("fgvhjbjknk")
    msg = {
      to: `${email}`, // Change to your recipient
      from: 'retvenssoftwares@gmail.com', // Change to your verified sender
      templateId: process.env.template_ID3,
      dynamicTemplateData: {
        username: username,
        text_here_1: hotelcode,
        text_here_2: hotelRcode,
      },
    };
  }

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
  }
};


// otp verification

const otpVerification = async (email, otp) => {
  const msg = {
    to: email,
    from: 'retvenssoftwares@gmail.com', // Replace with your verified sender email
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${otp}`,
    html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('OTP Verification Email sent successfully');
  } catch (error) {
    console.error('Error sending OTP Verification Email:', error.response.body);
  }
};


export { getCurrentUTCTimestamp, getDatesBetweenDates, validateHotelCode, convertToISODate, findUserByUserIdAndToken, verifyUser, uploadImageToS3, convertTimestampToCustomFormat, jwtTokenVerify, jwtsign, uploadMultipleImagesToS3, getCurrentLocalTimestamp, decrypt, encrypt, generateFourDigitRandomNumber, generateString, generateUserName, sendEmail , otpVerification };
