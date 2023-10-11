import * as dotenv from 'dotenv';
dotenv.config();
import s3 from "../utils/url.js"
import  jwt  from "jsonwebtoken";

//function to upload single image ot s3 spaces
const bucket = process.env.bucket
async function uploadImageToS3(file) {
    const params = {
        Bucket: bucket, // Replace with your S3 bucket name
        Key: `hotel_images/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    // const uploadResponse = await s3.upload(params).promise();
    // const imageUrl = uploadResponse.Location;
    const [uploadResponse] = await Promise.all([s3.upload(params).promise()]);
    const imageUrl = uploadResponse.Location

    return imageUrl;
}



//function to get utc time
async function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = now.toISOString(); // Convert to ISO string
    return utcTimestamp;
}

function getCurrentLocalTimestamp() {
    const localTimestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    return localTimestamp;
}

// Verify the token\
async function jwtTokenVerify() {
    jwt.verify(token, 'gcfgcgfcftcfctfctfctfctfctfcfcfcgfcghghcgcgcgccfccfcctrctcctct', (err, decoded) => {
        if (err) {
            // Token verification failed
            console.error('Token verification failed:', err.message);
            // Handle authentication failure here
        } else {
            // Token is valid, and `decoded` contains the payload data
            console.log('Token verified. User data:', decoded);

            // You can use `decoded` to extract user information or perform other actions.
            // For example, if you stored user ID in the payload, you can access it like this:
            // const userId = decoded.userId;

            // Handle authentication success here
        }
    });

}


async function jwtsign(payload){
    jwt.sign(payload, 'gcfgcgfcftcfctfctfctfctfctfcfcfcgfcghghcgcgcgccfccfcctrctcctct',(err,asyncToken)=>{
        if (err) throw err;
        console.log(asyncToken);
    })
}

export  { getCurrentUTCTimestamp, uploadImageToS3, jwtTokenVerify ,jwtsign, getCurrentLocalTimestamp};
