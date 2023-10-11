import Randomstring from 'randomstring';
import * as dotenv from 'dotenv';
dotenv.config();
import propertyModel from '../../models/property.js'
import getCurrentUTCTimestamp from '../../helpers/timestampHelper.js'
import uploadImageToS3 from '../../helpers/singleImageUploadHelper.js'

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
  
    // Upload the image and get the imageUrl
    const imageUrl = await uploadImageToS3(req.file);
    // console.log(imageUrl);

    //create record
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
    }) = req.body

    
       
  var hotelLogoId = Randomstring.generate(8);

    let image;

    uploadToS3(req.file)
      .then(async (imageUrl) => {
        image = imageUrl;
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
          hotelLogo: [
            {
              hotelLogoId,
              hotelLogo: image,
              modifiedDate: getCurrentUTCTimestamp(),
            },
          ],
        });
        await newProperty.save();

        return res.status(200).json({ message: "New property added successfully" });})

      .catch((error) => {
        // Handle errors, such as failed uploads
        console.error("File upload failed:", error);
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default postProperty;
