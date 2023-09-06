require("dotenv").config();
const moment = require("moment");
const roomTypeModel = require("../../models/Rooms/roomTypeModel");
const rateplan = require('../../models/Rates/ratePlan')
const ratetype = require('../../models/Rates/rateType')
const s3 = require('../../utils/url');
const property = require("../../models/Property/propertySetupModel")
const amenitiesId = require("../../models/Property/amenities")
const apiname = require('../../models/Users/apiHittingArray')

const iv = process.env.iv;

module.exports = async (req, res) => {
  try {
    //const formattedTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const roomTypedata  = await  roomTypeModel.findOne({roomTypeId : req.params.roomTypeId})
    const ratetypedata = await  ratetype.findOne({roomTypeId : req.params.roomTypeId})
    if(!roomTypedata || !ratetypedata){
      return res.status(500).json({ message: "Data not found" });
    }
    const {rateType} = ratetypedata
    const {roomTypeName, roomTypeId} = roomTypedata

 
    let mediaUrl;

    // Upload the file to DigitalOcean Spaces if a file has been selected
    if (req.file) {
      const params = {
        Bucket: 'rown-space-bucket/Event-img',
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      };
      await s3.upload(params).promise();
      mediaUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/Event-img/${req.file.originalname}`;
      
    }
    
  
      // Add current date to each media object
    //   const mediaWithDate = mediaData.map((mediaObj) => {
    //     return { ...mediaObj, date_added: moment().tz("Asia/Calcutta").format("YYYY-MM-DD HH:mm:ss")};
    //   });



    const data = new rateplan({        
        roomTypeId : roomTypeId,
        roomType : roomTypeName,
        rateType : rateType,
        webDescription : req.body.webDescription,
        baseAdult : req.body.baseAdult,
        baseChild : req.body.baseChild,
        maxChild : req.body.maxChild,
        maxAdult : req.body.maxAdult,
        maxNight : req.body.maxNight,
        minNight : req.body.minNight,
        inclusion : req.body.inclusion,
        rackRate : req.body.rackRate,
        extraAdultRate : req.body.extraAdultRate,
        ratePlanSortKey : req.body.ratePlanSortKey,
        publishedOnWeb : req.body.publishedOnWeb,
        photo : mediaUrl,
        showThisRateTypeToAllSources :req.body.showThisRateTypeToAllSources,
        added : req.body.added,
        modifiedBy : req.body.modifiedBy,
        modifiedDate : req.body.modifiedDate,
        timeStamp :  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });


    await data.save()

    // await apiname.updateOne(
    //   { userId: data.userId },
    //   {
    //     $push: {
    //       apiArray: {
    //         $each: [
    //           {
    //             apiname: "ratePlan added",
    //             role : data.role,
    //             deviceType : req.body.deviceType,
    //             ipaddress : req.body.ipaddress,
    //             timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

    //           }
    //         ],
    //         $position: 0
    //       }
    //     }
    //   }
    // );

    return res.status(200).json({ message: "rate Type added successfully" });


   
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};




