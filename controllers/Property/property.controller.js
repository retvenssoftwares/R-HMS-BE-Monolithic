import Randomstring from 'randomstring';
import * as dotenv from 'dotenv';
dotenv.config();
import propertyModel from '../../models/property.js'
import getCurrentUTCTimestamp from '../../helpers/timestampHelper.js'
import uploadImageToS3 from '../../helpers/singleImageUploadHelper.js'
import s3 from "../../utils/url.js"

//upload property controller
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
    } = req.body

    var hotelLogoId = Randomstring.generate(8)
    
    var bucket = process.env.bucket;
    // Upload the file to s3 Spaces if a file has been selected
    // if (req.file) {
    //   const params = {
    //     Bucket: bucket,
    //     Key: `hotel_images/${req.file.originalname}`,
    //     Body: req.file.buffer,
    //     ContentType: req.file.mimetype,
    //     ACL: 'public-read'
    //   };
    //   await s3.upload(params).promise();
    //   imageUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/hotel_images/${req.file.originalname}`;
    // }
    let image = '';
    // Upload the image and get the imageUrl
    const imageUrl = await uploadImageToS3(req.file);
    console.log(imageUrl);
    const newProperty = new propertyModel({
      userId,
      country,
      propertyAddress: [{
        propertyAddress,
        modifiedDate: getCurrentUTCTimestamp()
      }],
      propertyName: [{
        propertyName: propertyName,
        modifiedDate: getCurrentUTCTimestamp()
      }],
      postCode: [{
        postCode: postCode,
        modifiedDate: getCurrentUTCTimestamp()
      }],
      state: [{
        state: state,
        modifiedDate: getCurrentUTCTimestamp()
      }],
      city: [{
        city,
        modifiedDate: getCurrentUTCTimestamp()
      }],
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
    return res.status(200).json({ message: "New property added successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
};

export default postProperty;