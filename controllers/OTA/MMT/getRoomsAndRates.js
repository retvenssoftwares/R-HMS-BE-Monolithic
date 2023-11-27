import { parseString } from "xml2js";
import axios from "axios";

const XMLData = async (req, res) => {
  try {
    // Set headers directly in the Axios config
    const headers = {
      "Content-Type": "application/xml",
      "channel-token": "5f9belx9jn",
      "bearer-token": "7ca3675c8d",
    };

    const data = `<?xml version="1.0" encoding="UTF-8"?>
      <Website Name="ingoibibo" HotelCode="1000282881">
       <HotelCode>1000282881</HotelCode>
       <IsOccupancyRequired>false</IsOccupancyRequired>
      </Website>`.trim(); // Trim the XML string

    const response = await axios.post(
      "https://ppin-mmt.goibibo.com/api/chmv2/gethotellisting",
      data,
      { headers }
    );

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
    console.error("err", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default XMLData;
