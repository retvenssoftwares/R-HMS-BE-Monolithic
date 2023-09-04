require("dotenv").config();
const moment = require("moment");
const roomTypeModel = require("../../models/Rooms/roomTypeModel");
const ratetype = require("../../models/Rates/rateType");
const property = require("../../models/Property/propertySetupModel")
const amenitiesId = require("../../models/Property/amenities")
const apiname = require('../../models/Users/apiHittingArray')
const crypto = require("crypto");

const iv = process.env.iv;

module.exports = async (req, res) => {
  try {
    //const formattedTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    const roomTypeid  = await roomTypeModel.findOne({roomTypeId : req.params.roomTypeId})
    const {roomTypeId} = roomTypeid


    const data = new ratetype({
        roomTypeId : roomTypeId,
        rateType : req.body.rateType,
        rateSortKey : req.body.rateSortKey,
        totalDays : req.body.totalDays,
        ratePlaneName : req.body.ratePlaneName,
        baseRate : req.body.baseRate,
        extraAdult : req.body.extraAdult,
        extraChildRate : req.body.extraChildRate,
        rateThreshold : req.body.rateThreshold,
        validFrom : req.body.validFrom,
        till : req.body.till,
        minNight : req.body.minNight,
        maxNight : req.body.maxNight,
        postingRule : req.body.postingRule,
        chargeRule : req.body.chargeRule,
        addedBy : req.body.addedBy,
        modifiedBy :req.body.modifiedBy,
        modifiedDate : req.body.modifiedDate,
        rateTypeAmenities : req.body.rateTypeAmenities,
        timeStamp :  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });


    await data.save()

    console.log(data)

    await apiname.updateOne(
      { userId: data.userId },
      {
        $push: {
          apiArray: {
            $each: [
              {
                apiname: "rateType added",
                role : data.role,
                deviceType : req.body.deviceType,
                ipaddress : req.body.ipaddress,
                timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

              }
            ],
            $position: 0
          }
        }
      }
    );


    return res.status(200).json({ message: "rate added successfully" });

    

    

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};




