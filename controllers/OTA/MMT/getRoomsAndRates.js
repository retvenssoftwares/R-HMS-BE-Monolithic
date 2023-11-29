import { parseString } from "xml2js";
import axios from "axios";
import roomAndRateMap from '../../../models/OTAs/mappedRoomsAndRates.js';
import { findUserByUserIdAndToken } from "../../../helpers/helper.js";
const XMLData = async (req, res) => {
  try {
    const { userId, otaHotelCode, accessToken } = req.query
    if (!accessToken || !otaHotelCode) {
      return res.status(400).json({ message: "Please enter proper otaHotelCode and accessToken", statuscode: 400 })
    }

    const getConnectionId = await roomAndRateMap.findOne({ OTAHotelCode: otaHotelCode, userId: userId }, 'connectionId mappedOTARoomData mappedRatePlanData');
    if (!getConnectionId) {
      return res.status(400).json({ message: "Please enter proper otaHotelCode", statuscode: 400 })
    }
    // console.log(getConnectionId)
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
       <IsOccupancyRequired>true</IsOccupancyRequired>
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
                // console.log(roomData.AdultOccupancy.base);
                const ratePlans = result.HotelListing.RatePlanList.RatePlan.filter(
                  (ratePlanItem) => ratePlanItem.RoomTypeCode === roomTypeCode);

                // Check if the roomTypeCode exists in mappedOTARoomData
                const isMapped = getConnectionId.mappedOTARoomData.some(mappedRoom => mappedRoom.otaRoomTypeCode === roomTypeCode);

                // Check if RatePlanCode is in mappedRatePlanData
                const mappedRatePlanStatus = ratePlans.map(ratePlan => {
                  const mappedRatePlan = getConnectionId.mappedRatePlanData.find(mappedRatePlan => mappedRatePlan.otaRatePlanCode === ratePlan.RatePlanCode);
                  // console.log(mappedRatePlan)
                  // If the rate plan is mapped, include rateRule from mappedRatePlanData
                  if (mappedRatePlan) {
                    return {
                      ...ratePlan._doc,
                      "RoomTypeName": ratePlan.RoomTypeName || "",
                      "RoomTypeCode": ratePlan.RoomTypeCode || "",
                      mappedRatePlanStatus: 'true',
                      "RatePlanCode": ratePlan.RatePlanCode || "",
                      "RatePlanName": ratePlan.RatePlanName || "",
                      rateRule: mappedRatePlan.rateRule[0] || "", // Include rateRule from mappedRatePlanData
                    };
                  } else {
                    return {
                      ...ratePlan._doc,
                      "RoomTypeName": ratePlan.RoomTypeName || "",
                      "RoomTypeCode": ratePlan.RoomTypeCode || "",
                      mappedRatePlanStatus: 'false',
                      "RatePlanCode": ratePlan.RatePlanCode || "",
                      "RatePlanName": ratePlan.RatePlanName || "",
                      rateRule: "", // Set rateRule to default or empty if not mapped
                    };
                  }
                });

                const roomObject = {
                  RoomTypeName: roomData.RoomTypeName || "",
                  RoomTypeCode: roomData.RoomTypeCode || "",
                  baseOccupancy: roomData.AdultOccupancy.base || "0",
                  mappedRoomStatus: isMapped ? "true" : "false",
                  // IsActive: roomData.IsActive,
                  connectionId: getConnectionId.connectionId,
                  ratePlan: mappedRatePlanStatus,
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
    console.error("Error making API request:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default XMLData;
