import taskTypeModel from "../../models/taskModel.js";
import roomInFloorDetails from "../../models/roomInFloor.js";
import employeeModel from '../../models/houseKeepingModel.js';
import { findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js';
const getTasktype = async (req, res) => {
  try {
    const { userId, propertyId, taskType } = req.query;

    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (!result.success) {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

    // Validation logic for propertyId (assuming validateHotelCode is defined)
    const propertyValidationResult = await validateHotelCode(userId, propertyId);
    if (!propertyValidationResult.success) {
      return res.status(propertyValidationResult.statuscode).json({ message: "Invalid propertyId entered", statuscode: propertyValidationResult.statuscode });
    }

    // Mock data for roomDetails (replace with your actual logic to fetch room details)
    const roomDetails = await roomInFloorDetails.findOne({ propertyId: propertyId }).exec();

    if (!roomDetails) {
      return res.status(200).json({ message: "No room details found for the given propertyId", count: 0, statuscode: 200 });
    }

    // Extract floorData from roomDetails
    const { floorData } = roomDetails;

    // Query taskTypeModel with propertyId and taskType
    const taskTypes = await taskTypeModel.aggregate([
      {
        $match: {
          propertyId: propertyId,
          "taskType.0.taskType": taskType,
        },
      },
      {
        $unwind: "$assignedTo", // Unwind the assignedTo array
      },
      {
        $project: {
          taskName: { $arrayElemAt: ["$taskName.taskName", 0] },
          roomId: { $arrayElemAt: ["$roomId.roomId", 0] },
          floorId: { $arrayElemAt: ["$floorId.floorId", 0] },
          taskDescription: { $arrayElemAt: ["$taskDescription.taskDescription", 0] },
          time: { $arrayElemAt: ["$time.time", 0] },
          assignedTo: "$assignedTo.assignedTo",
          dueOn: { $arrayElemAt: ["$dueOn.dueOn", 0] },
          priority: { $arrayElemAt: ["$priority.priority", 0] },
          taskStatus: { $arrayElemAt: ["$taskStatus.taskStatus", 0] },
        },
      },
    ]).exec();

    if (!taskTypes || taskTypes.length === 0) {
      return res.status(200).json({ message: "No Task Types found", count: 0, statuscode: 200 });
    }

    // Iterate over each task and update room details
    const updatedTaskTypes = await Promise.all(taskTypes.map(async task => {
      // Assuming you have specific conditions to match the floor and room, adjust as needed
      const matchedFloor = floorData.find((floor) => floor.floorId === task.floorId);

      if (!matchedFloor) {
        return null; // Skip tasks without matching floor
      }

      const matchedRoom = matchedFloor.room.find((room) => room.roomId === task.roomId);

      if (!matchedRoom) {
        return null; // Skip tasks without matching room
      }

      // Fetch employee details for each assignedTo concurrently
      const assignedToDetailsPromises = task.assignedTo.map(async assignedToObj => {
        const employeeId = assignedToObj.assignedTo;
        console.log('employeeId: ', employeeId);

        // Assuming your employeeModel has the field 'employeeId' for matching
        const employeeDetails = await employeeModel.findOne({ employeeId }).exec();

        if (employeeDetails) {
          // Extract profilePhoto and fullName from the 0th object
          const profilePhoto = employeeDetails.profilePhoto[0]?.profilePhoto || '';
          const fullName = employeeDetails.fullName[0]?.fullName || '';


          return { profilePhoto, fullName, employeeId };
        }

        return null;
      });

      // Wait for all assignedToDetailsPromises to resolve
      const assignedToDetails = await Promise.all(assignedToDetailsPromises);

      // Update room details for the current task
      return {
        ...task,
        roomNumber: `Room No. ${matchedRoom.roomNumber}`,
        assignedToDetails,
      };
    }));

    return res.status(200).json({ data: updatedTaskTypes, statuscode: 200 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ data: "Internal server error", statuscode: 500 });
  }
};

export default getTasktype;
