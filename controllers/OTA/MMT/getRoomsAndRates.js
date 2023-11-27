import { parseString } from "xml2js";
import axios from "axios";
import mmtModel from '../../../models/OTAs/mmtModel.js'
import { findUserByUserIdAndToken } from "../../../helpers/helper.js";
const XMLData = async (req, res) => {
  try {
    const { userId, otaHotelCode, accessToken } = req.query
    if (!accessToken || !otaHotelCode) {
      return res.status(400).json({ message: "Please enter proper otaHotelCode and accessToken", statuscode: 400 })
    }
    // console.log("erthfgbv", userId, otaHotelCode)
    const authCodeValue = req.headers['authcode']

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    // console.log("sdfg", result)
    if (!result.success) {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
    const headers = {
      "Content-Type": "application/xml",
      "channel-token": process.env.mmtChannelToken,
      "bearer-token": accessToken,
    };

    const data = `<?xml version="1.0" encoding="UTF-8"?>
      <Website Name="ingoibibo" HotelCode="${otaHotelCode}">
       <HotelCode>${otaHotelCode}</HotelCode>
       <IsOccupancyRequired>false</IsOccupancyRequired>
      </Website>`.trim(); // Trim the XML string

    const response = await axios.post(
      "https://ppin-mmt.goibibo.com/api/chmv2/gethotellisting",
      data,
      { headers }
    );

    // console.log("ol,oo", response);
    // Convert XML to JSON
    parseString(
      response.data,
      { explicitArray: false, mergeAttrs: true },
      (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return res
            .status(500)
            .json({ message: "Error parsing XML", statuscode: 500 });
        } else {
          const roomTypeCodes = result.HotelListing.RoomList.Room.map(
            (item) => item.RoomTypeCode);

          var room = [];

          roomTypeCodes.forEach((roomTypeCode) => {
            if (roomTypeCode) {

              const roomData = result.HotelListing.RoomList.Room.find(
                (roomListItem) => roomListItem.RoomTypeCode === roomTypeCode);

              if (roomData) {

                const ratePlans = result.HotelListing.RatePlanList.RatePlan.filter(
                  (ratePlanItem) => ratePlanItem.RoomTypeCode === roomTypeCode);

                const roomObject = {
                  RoomTypeName: roomData.RoomTypeName,
                  RoomTypeCode: roomData.RoomTypeCode,
                  IsActive: roomData.IsActive,
                  ratePlan: ratePlans,
                };

                room.push(roomObject);
              }
            }
          });

          return res.status(200).json({ data: room, statuscode: 200 });
        }
      }
    );

  } catch (err) {
    console.error("Error making API request:", err.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default XMLData;
