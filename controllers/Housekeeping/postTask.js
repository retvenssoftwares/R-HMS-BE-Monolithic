import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import taskTypeModel from "../../models/taskModel.js";
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken,
  validateHotelCode
} from "../../helpers/helper.js";

const postTask = async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      taskName,
      roomId,
      floorId,
      taskDescription,
      time,
      dueOn,
      priority,
      taskStatus,
      assignedTo,
      taskType,
    } = req.body;
    const authCodeValue = req.headers["authcode"];
    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser) {
      return res
        .status(400)
        .json({ message: "User not found or invalid userId", statuscode: 400 });
    }
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const result2 = await validateHotelCode(userId, propertyId)
    if (!result2.success) {
      return res
        .status(result2.statuscode)
        .json({ message: result2.message, statuscode: result2.statuscode });
    }
    const currentUTCTime = await getCurrentUTCTimestamp();

    if (result.success) {
      let userRole = findUser.role[0].role;
      const assignedTo = req.body.assignedTo || [];
      const assignedToArray = assignedTo.map(id => ({
        assignedTo: id,
        logId: Randomstring.generate(10),
      }));
      const newTask = new taskTypeModel({
        propertyId,
        taskId: Randomstring.generate(8),
        taskName: [{
          taskName: taskName,
          logId: Randomstring.generate(10),
        }],
        roomId: [{
          roomId: roomId,
          logId: Randomstring.generate(10),
        }],
        floorId: [{
          floorId: floorId,
          logId: Randomstring.generate(10),
        }],
        taskDescription: [{
          taskDescription: taskDescription,
          logId: Randomstring.generate(10),
        }],
        time: [{
          time: time,
          logId: Randomstring.generate(10),
        }],
        dueOn: [{
          dueOn: dueOn,
          logId: Randomstring.generate(10),
        }],
        priority: [{
          priority: priority,
          logId: Randomstring.generate(10),
        }],
        taskStatus: [{
          taskStatus: taskStatus,
          logId: Randomstring.generate(10),
        }],
        taskType: [{
          taskType: taskType,
          logId: Randomstring.generate(10),
        }],

        createdBy: userRole,

        createdOn: await getCurrentUTCTimestamp(),
        displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
        createdOn: currentUTCTime,

        modifiedBy: [],
        modifiedOn: [],
        assignedTo: assignedToArray.length > 0 ? [{
          assignedTo: assignedToArray,
        }] : [],

      });
      await newTask.save();

      return res
        .status(200)
        .json({ message: "New task added successfully", statuscode: 200 });
    } else {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};
export default postTask;