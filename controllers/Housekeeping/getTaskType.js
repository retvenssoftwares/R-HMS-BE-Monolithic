import taskTypeModel from "../../models/taskModel.js";
import {
  findUserByUserIdAndToken,
  validateHotelCode,
} from "../../helpers/helper.js";

const getTasktype = async (req, res) => {
  try {
    const { userId, propertyId, taskType } = req.query;
    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
      const results = await validateHotelCode(userId, propertyId);
      if (!results.success) {
        return res.status(results.statuscode).json({
          message: "Invalid propertyId entered",
          statuscode: results.statuscode,
        });
      }
      const taskTypes = await taskTypeModel
        .aggregate([
            {
                $match: {
                  propertyId: propertyId,
                  "taskType.0.taskType":taskType
                },
              },
              
          {
            $project: {
              taskName: { $arrayElemAt: ["$taskName.taskName", 0] },
              roomId: { $arrayElemAt: ["$roomId.roomId", 0] },
              taskDescription: {
                $arrayElemAt: ["$taskDescription.taskDescription", 0],
              },
              time: { $arrayElemAt: ["$time.time", 0] },
              dueOn: { $arrayElemAt: ["$dueOn.dueOn", 0] },
              priority: { $arrayElemAt: ["$priority.priority", 0] },
              taskStatus: { $arrayElemAt: ["$taskStatus.taskStatus", 0] },
            },
          },
        ]).exec();
        if (!taskTypes || taskTypes.length === 0) {
            return res.status(200).json({ message: "NO Task Types found",count:0, statuscode: 200 });
          }
      return res.status(200).json({ data: taskTypes, statuscode: 200 });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ data: "Internal server error", statuscode: 500 });
  }
};
export default getTasktype;
