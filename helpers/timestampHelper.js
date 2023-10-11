import s3 from "../utils/url.js"

function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = Math.floor(now.getTime() / 1000); // Convert to seconds
    return utcTimestamp;
  }


  async function uploadToS3(file) {
    try {
      const params = {
        Bucket: 'rown-space-bucket',
        Key: `hotel_images/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
  
      await s3.upload(params).promise();
  
      const imageUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/hotel_images/${file.originalname}`;
      return imageUrl;
    } catch (error) {
      throw error;
    }

  }
  export  {getCurrentUTCTimestamp ,uploadToS3}


