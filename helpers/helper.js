import s3 from "../utils/url.js"
import  jwt  from "jsonwebtoken";

async function uploadImageToS3(file) {
    const bucket = process.env.bucket;

    try {
        if (!file) {
            throw new Error('No file provided for upload.');
        }

        const params = {
            Bucket: bucket,
            Key: `hotel_images/${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        const uploadResponse = await s3.upload(params).promise();
        const imageUrl = uploadResponse.Location;

        return imageUrl;
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error; // Re-throw the error for handling at a higher level
    }
}




function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = now.toISOString(); // Convert to ISO string
    return utcTimestamp;
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

export { getCurrentUTCTimestamp, uploadImageToS3, jwtTokenVerify ,jwtsign};