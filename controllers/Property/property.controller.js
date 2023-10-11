import Randomstring from 'randomstring';
import * as dotenv from 'dotenv';
dotenv.config();
import propertyModel from '../../models/property.js'
import { getCurrentUTCTimestamp, uploadImageToS3 } from '../../helpers/helper.js'
// import uploadImageToS3 from '../../helpers/singleImageUploadHelper.js'

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
      hotelLogo: [
        {
          hotelLogoId,
          hotelLogo: imageUrl,
          modifiedDate: getCurrentUTCTimestamp(),
        },
      ],
      baseCurrency,
      websiteUrl,
      propertyChainName,
      propertyType,
    }) 

    
    await newProperty.save();

    return res.status(200).json({ message: "New property added successfully" });
  }
 catch (err) {
  console.log(err);
  res.status(500).json({ message: "Internal Server Error" });
}
}


const editProperty = async (req,res)=>{
  const propertyId = await propertyModel.findOne({propertyId : req.body.propertyId})

  const addDetails = {
    propertyTypeName :propertyId.propertyTypeName,
    starCategory :  propertyId.starCategory,
    roomsInProperty : propertyId.roomsInProperty,
    taxName : propertyId.taxName,
    registerNumber : propertyId.registerNumber,
    ratePercent : propertyId.ratePercent
  }

  await addDetails.save()
}

export  {postProperty , editProperty}
