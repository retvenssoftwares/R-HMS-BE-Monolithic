import s3 from "../utils/url.js"

export  default async function uploadImageToS3(file) {
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
