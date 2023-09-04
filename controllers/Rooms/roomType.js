require("dotenv").config();
const moment = require("moment");
const roomTypeModel = require("../../models/Rooms/roomTypeModel");
const property = require("../../models/Property/propertySetupModel")
const s3 = require('../../utils/url');
const amenitiesId = require("../../models/Property/amenities")
const apiname = require('../../models/Users/apiHittingArray')
const crypto = require("crypto");

const iv = process.env.iv;

module.exports = async (req, res) => {
  try {
    //const formattedTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const propertyid  = await  property.findOne({propertyId: req.params.propertyId})

    const {propertyId} = propertyid

    const mediaData = await Promise.all(req.files.map(async (file) => {
      const params = {
        Bucket: 'rown-space-bucket/post-images',
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };
      await s3.upload(params).promise();
      
      return { post: `https://rown-space-bucket.nyc3.digitaloceanspaces.com/post-images/${file.originalname}` };
    }));


    const data = new roomTypeModel({
        propertyId : propertyId,
        roomTypeSortKey : req.body.roomTypeSortKey,
        roomTypeName : req.body.roomTypeName,
        baseAdult : req.body.baseAdult,
        baseChild : req.body.baseChild,
        maxChild : req.body.maxChild,
        maxAdult : req.body.maxAdult,
        extraAdultRate : req.body.extraAdultRate,
        extraChildRate : req.body.extraChildRate,
        maxRoomOccupancy : req.body.maxRoomOccupancy,
        roomTypeInventory : req.body.roomTypeInventory,
        baseRate : req.body.baseRate,
        roomTypeDescription : req.body.roomTypeDescription,
        rateThresholdMin : req.body.rateThresholdMin,
        rateThresholdMax : req.body.rateThresholdMax,
        ratePlanIdArray : req.body.ratePlanIdArray,
        rateTypeIdArray :req.body.rateTypeIdArray,
        roomTypeAmenities : req.body.roomTypeAmenities,
        roomTypeImages: mediaData.map(url => ({ roomImage: url.post })),
        addedBy : req.body.addedBy,
        modifiedBy : req.body.modifiedBy,
        modifiedDate : req.body.modifiedDate, 
        timeStamp :  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });


    await data.save()


    propertyid.roomType.push({ roomTypeId: data.roomTypeId });
    await propertyid.save();


    return res.status(200).json({ message: "Room added Successfully" });

  

   
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};



