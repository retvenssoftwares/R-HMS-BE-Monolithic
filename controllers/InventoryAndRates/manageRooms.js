import blockedRoomsModel from "../../models/blockedRooms.js";
import manageInventoryModel from "../../models/manageInventory.js";
import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";
const blockedRooms = async (req, res) => {
    try {

        const { userId } = req.query
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            const {
                propertyId,
                roomTypeId,
                roomId,
                reason,
                date,
                status
            } = req.body

            const today = new Date().toISOString().split("T")[0];

            // Parse startDate as a Date object
            const startDateObj = new Date(date).toISOString().split("T")[0];

            // Check if startDate is older than today's date
            if (startDateObj < today) {
                return res.status(400).json({
                    message: "Date must not be older than today's date",
                    statuscode: 400,
                });
            }

            const findRoom = await blockedRoomsModel.findOne({ propertyId: propertyId, roomTypeId: roomTypeId });
            let findInventory = await manageInventoryModel.findOne({
                roomTypeId: roomTypeId,
                propertyId: propertyId,
            });
            if (!findInventory) {
                return res.status(404).json({ message: "Inventory record does not exist", statuscode: 404 })
            }
            const findRoomType = await roomTypeModel.findOne({ roomTypeId: roomTypeId, propertyId: propertyId });
            const baseInventory = findRoomType.numberOfRooms[0].numberOfRooms || 0;
            const start = new Date(date);
            const newDate = new Date(start);
            // newDate.setDate(newDate.getDate() + i);
            const dateString = newDate.toISOString().split("T")[0];
            console.log(dateString)

            //if blocked room record not found
            if (!findRoom) {
                const newBlockedRoom = new blockedRoomsModel({
                    propertyId: propertyId,
                    roomTypeId: roomTypeId,
                    blockedRooms: [{
                        roomId: roomId,
                        reason: reason,
                        date: date,
                        status: status,
                        modifiedOn: await getCurrentUTCTimestamp()
                    }]
                })

                // Find the index of the date in addedInventory, if it exists
                let existingEntryIndex =
                    findInventory.manageInventory.blockedInventory.findIndex(
                        (entry) => entry.date === dateString
                    );
                console.log(existingEntryIndex)

                const existingEntryIndexAdded =
                    findInventory.manageInventory.addedInventory.findIndex(
                        (entry) => entry.date === dateString
                    );
                let addedInventory = 0;
                let blockedInventory = 0;
                if (existingEntryIndex !== -1) {
                    blockedInventory = findInventory.manageInventory.blockedInventory[existingEntryIndex].blockedInventory
                }
                if (existingEntryIndexAdded !== -1) {
                    addedInventory = findInventory.manageInventory.addedInventory[existingEntryIndexAdded].addedInventory
                }

                const availableInventory = baseInventory + addedInventory - blockedInventory
                console.log(availableInventory, "ai")
                if (availableInventory <= 0) {
                    return res.status(200).json({ message: "Not enough inventory to block room", statuscode: 200 })
                }

                if (existingEntryIndex !== -1) {
                    // If the date exists, update the blockedinventory
                    findInventory.manageInventory.blockedInventory[
                        existingEntryIndex
                    ].blockedInventory = findInventory.manageInventory.blockedInventory[
                        existingEntryIndex
                    ].blockedInventory + 1;
                } else {
                    // If the date does not exist, add a new entry to addedInventory
                    findInventory.manageInventory.blockedInventory.push({
                        date: dateString,
                        blockedInventory: 1,
                    });
                }
                await newBlockedRoom.save();

                //if blocked room record is found
            } else {

                let existingRoomObject =
                    findRoom.blockedRooms.findIndex(
                        (entry) => entry.date === dateString && entry.roomId === roomId
                    );

                console.log(existingRoomObject)
                //if index not found then push object
                if (existingRoomObject === -1) {
                    console.log("55")
                    await blockedRoomsModel.findOneAndUpdate(
                        { propertyId: propertyId, roomTypeId: roomTypeId },
                        {
                            $push: {
                                blockedRooms: {
                                    roomId: roomId,
                                    reason: reason,
                                    date: date,
                                    status: status,
                                    modifiedOn: await getCurrentUTCTimestamp()
                                }
                            }
                        },
                        { new: true })
                } else {
                    findRoom.blockedRooms[
                        existingRoomObject
                    ].reason = reason;
                    findRoom.blockedRooms[
                        existingRoomObject
                    ].status = status;
                    findRoom.blockedRooms[
                        existingRoomObject
                    ].modifiedOn = await getCurrentUTCTimestamp();
                }

                // Find the index of the date in addedInventory/blockedinventory, if it exists
                const existingEntryIndex =
                    findInventory.manageInventory.blockedInventory.findIndex(
                        (entry) => entry.date === dateString
                    );
                const existingEntryIndexAdded =
                    findInventory.manageInventory.addedInventory.findIndex(
                        (entry) => entry.date === dateString
                    );
                let addedInventory = 0;
                let blockedInventory = 0;
                if (existingEntryIndexAdded !== -1) {
                    addedInventory = findInventory.manageInventory.addedInventory[existingEntryIndexAdded].addedInventory
                }
                if (existingEntryIndex !== -1) {
                    blockedInventory = findInventory.manageInventory.blockedInventory[existingEntryIndex].blockedInventory
                }

                const availableInventory = baseInventory + addedInventory - blockedInventory
                console.log(availableInventory, "ai")
                if (availableInventory <= 0) {
                    return res.status(200).json({ message: "Not enough inventory to block room", statuscode: 200 })
                }

                if (existingEntryIndex !== -1) {
                    // If the date exists, update the blockedinventory
                    findInventory.manageInventory.blockedInventory[
                        existingEntryIndex
                    ].blockedInventory = findInventory.manageInventory.blockedInventory[
                        existingEntryIndex
                    ].blockedInventory + 1;
                } else {
                    // If the date does not exist, add a new entry to addedInventory
                    findInventory.manageInventory.blockedInventory.push({
                        date: dateString,
                        blockedInventory: 1,
                    });
                }
                await findRoom.save();
            }

            await findInventory.save();

            return res.status(200).json({ message: "Room Blocked Successfully", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default blockedRooms