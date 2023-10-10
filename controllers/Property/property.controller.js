import Randomstring from 'randomstring';
import propertyModel from '../../models/property.js'
import getCurrentUTCTimestamp from '../../helpers/timestampHelper.js'
 const postProperty = async (req, res) => {
  try {
    const { userId,
      country,
      propertyAddress,
      propertyName,
      postCode,
      state,
      city,
      baseCurrency,
      websiteUrl,
      propertyChainName,
      propertyType,
      hotelLogo } = req.body

    var hotelLogoId = Randomstring.generate(8)
    let imageUrl;

    // Upload the file to Amazon s3 Spaces if a file has been selected
    if (req.file) {
      const params = {
        // Bucket: 'rown-space-bucket/hotel_images',
        // Key: hotel_image.originalname,
        // Body: hotel_image.buffer,
        // ContentType: hotel_image.mimetype,
        // ACL: 'public-read'
        Bucket: 'rown-space-bucket/hotel_images', 
        Key: `hotel_images/${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      };
      await s3.upload(params).promise();
      imageUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/hotel_images/${req.file.originalname}`;
    }

    const newProperty = new propertyModel({
      userId,
      country,
      propertyAddress,
      propertyName,
      postCode,
      state,
      city,
      baseCurrency,
      websiteUrl,
      propertyChainName,
      propertyType,
      hotelLogo: [{
        hotelLogoId,
        hotelLogo: imageUrl,
        modifiedDate: getCurrentUTCTimestamp()
      }]
    })
    await newProperty.save();

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
};

export default postProperty;