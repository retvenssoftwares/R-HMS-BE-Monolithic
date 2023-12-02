import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import taskTypeModel from "../../models/taskModel.js";
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken,
} from "../../helpers/helper.js";

const postTask = async (req , res) => {
    try{
        const {
          userId,
          employeeId,
          propertyId,
          taskId,
          taskName,
          roomId,
          taskDescription,
          time,
          dueOn,
          priority,
          taskStatus,
          assignedTo,
          taskType,
          floorId
        }= req.body;
        const authCodeValue = req.headers["authcode"];
        const findUser = await verifiedUser.findOne({ userId });
        if (!findUser) {
          return res
            .status(400)
            .json({ message: "User not found or invalid userId", statuscode: 400 });
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const currentUTCTime = await getCurrentUTCTimestamp();
    
        if (result.success) {
          let userRole = findUser.role[0].role;
          const newTask = new taskTypeModel({
             propertyId,
             employeeId,
             taskId: Randomstring.generate(8),
             taskName: [{
              taskName: taskName,
              logId: Randomstring.generate(8),
             }],
             roomId: [{
               roomId: roomId,
               logId: Randomstring.generate(8),
             }],
             floorId: [{
              floorId: floorId,
               logId: Randomstring.generate(8),
             }],
             taskDescription: [{
              taskDescription: taskDescription,
              logId: Randomstring.generate(8),
            }],
            time: [{
              time: time,
              logId: Randomstring.generate(8),
            }],
            dueOn: [{
              dueOn: dueOn,
              logId: Randomstring.generate(8),
            }],
            priority: [{
              priority: priority,
              logId: Randomstring.generate(8),
            }],
            taskStatus: [{
              taskStatus: taskStatus,
              logId: Randomstring.generate(8),
            }],
            taskType: [{
              taskType: taskType,
              logId: Randomstring.generate(8),
            }],
            
            createdBy: userRole,

            createdOn: await getCurrentUTCTimestamp(),
            displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
            createdOn: currentUTCTime,

            modifiedBy: [],
            modifiedOn: [],
            assignedTo: [{
              assignedTo: assignedTo,
              logId: Randomstring.generate(8),
            }],
            
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
    }catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};
export default postTask;