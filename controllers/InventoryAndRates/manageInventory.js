import manageInventoryModel from "../../models/manageInventory.js";
import roomType from "../../models/roomType.js";

const manageInventory = async (req, res) => {
  try {
    const {
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
    // Get today's date as a string in "yyyy-mm-dd" format
    const today = new Date().toISOString().split("T")[0];

    // Parse startDate as a Date object
    const startDateObj = new Date(startDate).toISOString().split("T")[0];

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

 
 

    // Calculate the baseInventory + inventory value
 //  const totalInventory = baseInventory + latestInventory;
 

    // Calculate the result of baseInventory - inventory for blockedInventory
    //const totalBlockedInventory = baseInventory - inventory;

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
      //const existingEntry = findInventory.manageInventory.blockedInventory.find((entry) => entry.date === dateString);
      const existingEntryIndex =
      findInventory.manageInventory.addedInventory.find(
        (entry) => entry.date === dateString
      );
      const addedInventory =existingEntryIndex.addedInventory

     // console.log(addedInventory)

      const totalInventory = baseInventory + addedInventory;
      console.log(totalInventory)

      if (isBlockedInventory) {
        // Update the blockedInventory array
        if (totalInventory < inventory) {
          return res.status(400).json({
            message: "Inventory value cannot be greater than baseInventory",
            statuscode: 400,
          });
        }
        const existingEntryIndex =
          findInventory.manageInventory.blockedInventory.findIndex(
            (entry) => entry.date === dateString
          );
     

        if (existingEntryIndex !== -1) {
          // If the date exists, update the blockedInventory
          findInventory.manageInventory.blockedInventory[
            existingEntryIndex
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
}

    // Save the updated inventory document
    await findInventory.save();
    // await findDumpInventory.save();

    return res
      .status(200)
      .json({ message: "Inventory updated successfully", statuscode: 200 });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", statuscode: 500 });
  }
};

export default manageInventory;

// import manageInventoryModel from '../../models/manageInventory.js'
// import roomType from '../../models/roomType.js'

// const manageInventory = async (req, res) => {
//     try {
//         const { propertyId, roomTypeId, startDate, endDate, isAddedInventory, isBlockedInventory, inventory, source, days } = req.body;
//         // Get today's date as a string in "yyyy-mm-dd" format
//         const today = new Date().toISOString().split('T')[0];

//         // Parse startDate as a Date object
//         const startDateObj = new Date(startDate).toISOString().split('T')[0];

//         // Check if startDate is older than today's date
//         if (startDateObj < today) {
//             return res.status(400).json({ message: "startDate must not be older than today's date", statuscode: 400 });
//         }

//         // Find the inventory document for the specified roomTypeId
//         let findInventory = await manageInventoryModel.findOne({ roomTypeId: roomTypeId, propertyId: propertyId });
//         let findRoom = await roomType.findOne({ propertyId: propertyId, roomTypeId: roomTypeId }).select('numberOfRooms');
//         let baseInventory = findRoom.numberOfRooms[0].numberOfRooms;

//         // Create the inventory record if it doesn't exist
//         if (!findInventory) {
//             findInventory = new manageInventoryModel({
//                 roomTypeId: roomTypeId,
//                 propertyId: propertyId,
//                 source: source,
//                 manageInventory: {
//                     addedInventory: [],
//                     blockedInventory: []
//                 }
//             });
//         }

//         // Calculate the number of days in the date range
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));

//         if (dayDifference < 0) {
//             return res.status(400).json({ message: "End date cannot be before the start date", statuscode: 400 });
//         }

//         for (let i = 0; i <= dayDifference; i++) {
//             const date = new Date(start);
//             date.setDate(date.getDate() + i);

//             const dateString = date.toISOString().split('T')[0];

//             if (!days || days.includes(date.toLocaleDateString("en-US", { weekday: "long" }))) {
//                 if (isAddedInventory) {
//                     // Update the addedInventory array
//                     const existingEntry = findInventory.manageInventory.addedInventory.find(entry => entry.date === dateString);

//                     if (existingEntry) {
//                         // If the date exists, update the addedInventory
//                         existingEntry.addedInventory = baseInventory + inventory;
//                     } else {
//                         // If the date does not exist, add a new entry to addedInventory
//                         findInventory.manageInventory.addedInventory.push({ date: dateString, addedInventory: inventory });
//                     }
//                 }

//                 if (isBlockedInventory) {
//                     // Update the blockedInventory array
//                     if (baseInventory < inventory) {
//                         return res.status(400).json({ message: "Inventory value cannot be greater than baseInventory", statuscode: 400 })
//                     }
//                     const existingEntry = findInventory.manageInventory.blockedInventory.find(entry => entry.date === dateString);

//                     if (existingEntry) {
//                         // If the date exists, update the blockedInventory
//                         existingEntry.blockedInventory = baseInventory - inventory;
//                     } else {
//                         // If the date does not exist, add a new entry to blockedInventory
//                         findInventory.manageInventory.blockedInventory.push({ date: dateString, blockedInventory: inventory });
//                     }
//                 }
//             }
//         }

//         // Save the updated inventory document
//         await findInventory.save();

//         return res.status(200).json({ message: "Inventory updated successfully", statuscode: 200 });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal server error", statuscode: 500 });
//     }
// }

// export default manageInventory;
