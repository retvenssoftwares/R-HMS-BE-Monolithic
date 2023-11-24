
import manageInventoryModel from "../../models/manageInventory.js";
import roomType from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import getInventory from "../InventoryAndRates/getInventory.js";
import mmtModel from "../../models/OTAs/mmtModel.js"
import mapData from "../../models/OTAs/mappedRoomsAndRates.js"
const manageInventory = async (req, res, io) => {
  try {
    const {
      userId,
      propertyId,
      roomTypeId,
      startDate,
      endDate,
      isAddedInventory,
      isBlockedInventory,
      inventory,
      source,
      days
    } = req.body;
    const authCodeValue = req.headers['authcode']

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    //
    const findModel = await mmtModel.findOne({ userId }).lean();
    if (!findModel) {
        return res.status(404).json({ message: "Invalid userId entered", statuscode: 404 })
    }
    const { mmtHotelCode, accessToken } = findModel

//
    const mapModel = await mapData.findOne({ userId }).lean();
    if (!mapModel) {
      return res.status(404).json({ message: "Incorrect userId", statuscode: 404 });
  }
  const existingEntryIndex = mapModel.mappedOTARoomData.findIndex(
      (entry) => entry.roomTypeId === roomTypeId
  );

  const otaRoomTypeCode = mapModel.mappedOTARoomData[existingEntryIndex].otaRoomTypeCode
  // console.log(findRecord.mappedRatePlanData[existingEntryIndex].otaRatePlanCode)

  if (existingEntryIndex === -1) {
      return res.status(400).json({ message: "Invalid otaRoomTypeCode", statuscode: "400" });
  }


    if (result.success) {
      // Get today's date as a string in "yyyy-mm-dd" format
      const today = new Date().toISOString().split("T")[0];

      // Parse startDate as a Date object
      const startDateObj = new Date(startDate).toISOString().split("T")[0];

        // Parse startDate as a Date object
        const endDateObj = new Date(endDate).toISOString().split('T')[0];

      // Check if startDate is older than today's date
      if (startDateObj < today) {
        return res.status(400).json({
          message: "startDate must not be older than today's date",
          statuscode: 400,
        });
      }

      // Find the inventory document for the specified roomTypeId
      let findInventory = await manageInventoryModel.findOne({
        roomTypeId: roomTypeId,
        propertyId: propertyId,
      });
      let findRoom = await roomType
        .findOne({ propertyId: propertyId, roomTypeId: roomTypeId })
        .select("numberOfRooms");
      let baseInventory = findRoom.numberOfRooms[0].numberOfRooms;


      // Create the inventory record if it doesn't exist
      if (!findInventory) {
        findInventory = new manageInventoryModel({
          roomTypeId: roomTypeId,
          propertyId: propertyId,
          source: source,
          manageInventory: {
            addedInventory: [],
            blockedInventory: [],
          },
        });
      }

      // Calculate the number of days in the date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24)); //difference in the dates interval

      if (dayDifference < 0) {
        return res.status(400).json({
          message: "End date cannot be before the start date",
          statuscode: 400,
        });
      }
      const apiUrl = process.env.mmtV3ARI

      //
      if(isAddedInventory){
        const xmlData =`<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
        <AvailRateUpdate locatorID="1">
            <DateRange from="${startDateObj}" to="${endDateObj}" sun="true" mon="false" tue="false" wed="false" thu="false" fri="true" sat="true"/>
            <Availability code="${otaRoomTypeCode}" count="${inventory}" closed="${isAddedInventory}" />
        </AvailRateUpdate>
    </AvailRateUpdateRQ>`;
    
      // Set headers
      const headers = {
        'Content-Type': 'application/xml',
        'channel-token': process.env.mmtChannelToken,
        'bearer-token': accessToken,
    };
     // Make the Axios POST request
     axios.post(apiUrl, xmlData, { headers })
     .then(response => {
         console.log('API Response:', response.data);
         // return res.status(200).json({ message: "Connection successfully established", statuscode: 200 })
     })
     .catch(error => {
         console.error('Error making API request:', error.message);
         // return res.status(500).json({ message: "Some error occured during connection, please try again later", statuscode: 500 })
     });

      }

      //
      if(isBlockedInventory){

        const xmlData =`<AvailRateUpdateRQ hotelCode="${mmtHotelCode}" timeStamp="">
        <AvailRateUpdate locatorID="1">
            <DateRange from="${startDateObj}" to="${endDateObj}" sun="true" mon="false" tue="false" wed="false" thu="false" fri="true" sat="true"/>
            <Availability code="${otaRoomTypeCode}" count="${inventory}" closed="${isBlockedInventory}" />
        </AvailRateUpdate>
    </AvailRateUpdateRQ>`;
    
      // Set headers
      const headers = {
        'Content-Type': 'application/xml',
        'channel-token': process.env.mmtChannelToken,
        'bearer-token': accessToken,
    };
     // Make the Axios POST request
     axios.post(apiUrl, xmlData, { headers })
     .then(response => {
         console.log('API Response:', response.data);
         // return res.status(200).json({ message: "Connection successfully established", statuscode: 200 })
     })
     .catch(error => {
         console.error('Error making API request:', error.message);
         // return res.status(500).json({ message: "Some error occured during connection, please try again later", statuscode: 500 })
     });

      }


      for (let i = 0; i <= dayDifference; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);

        const dateString = date.toISOString().split("T")[0];
        // console.log(dateString)
        if (!days || days.includes(date.toLocaleDateString("en-US", { weekday: "long" }))) {
          if (isAddedInventory) {
            // Find the index of the date in addedInventory, if it exists
            const existingEntryIndex =
              findInventory.manageInventory.addedInventory.findIndex(
                (entry) => entry.date === dateString
              );

            if (existingEntryIndex !== -1) {
              // If the date exists, update the addedInventory
              findInventory.manageInventory.addedInventory[
                existingEntryIndex
              ].addedInventory = inventory;
            } else {
              // If the date does not exist, add a new entry to addedInventory
              findInventory.manageInventory.addedInventory.push({
                date: dateString,
                addedInventory: inventory,
              });
            }
          }


          if (isBlockedInventory) {
            let addedInventory;
            // Update the blockedInventory array

            //const existingEntry = findInventory.manageInventory.blockedInventory.find((entry) => entry.date === dateString);
            const existingEntryIndex =
              findInventory.manageInventory.addedInventory.find(
                (entry) => entry.date === dateString
              );
            if (!existingEntryIndex) {
              if (baseInventory < inventory) {
                return res.status(400).json({
                  message: "Inventory value cannot be greater than baseInventory",
                  statuscode: 400,
                });
              }
            } else {
              addedInventory = existingEntryIndex.addedInventory
            }

            // console.log(addedInventory)

            const totalInventory = baseInventory + addedInventory;
            // console.log(totalInventory)
            if (totalInventory < inventory) {
              return res.status(400).json({
                message: "Inventory value cannot be greater than total inventory",
                statuscode: 400,
              });
            }
            const existingEntry =
              findInventory.manageInventory.blockedInventory.findIndex(
                (entry) => entry.date === dateString
              );


            if (existingEntry !== -1) {
              // If the date exists, update the blockedInventory
              findInventory.manageInventory.blockedInventory[
                existingEntry
              ].blockedInventory = inventory;
            } else {
              // If the date does not exist, add a new entry to blockedInventory
              findInventory.manageInventory.blockedInventory.push({
                date: dateString,
                blockedInventory: inventory,
              });
            }
          }
        }

        // Save the updated inventory document
        await findInventory.save();

      }

      const availableRooms = await getInventory({
        query: {
          userId,
          propertyId,
          checkInDate: startDate,
          checkOutDate: endDate,
          status: true
        },
        headers: {
          authcode: authCodeValue
        }

      }, res); // Pass the `res` object to the function

      // You can now access the response data from the getInventory function
      // console.log(availableRooms, "getInventoryResponse");

      io.emit("inventoryUpdated", availableRooms);

      // const resData =  getInventoryResponse.data.availableRooms
      // console.log(resData, "payloadpayloadpayloadpayload")

      return res
        .status(200)
        .json({ message: "Inventory updated successfully", statuscode: 200 });
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", statuscode: 500 });
  }
};

export default manageInventory;

