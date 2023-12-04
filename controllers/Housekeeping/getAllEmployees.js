import employeeModel from '../../models/houseKeepingModel.js';
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
const getAllEmployees = async (req, res) => {
    try {
        const { userId, propertyId } = req.query;
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const employeesData = await employeeModel.aggregate([
            {
                $match: {
                    propertyId: propertyId,
                }
            },
            {
                $project: {
                    designation: { $arrayElemAt: ["$designation.designation", 0] },
                    employmentStartDate: { $arrayElemAt: ["$employmentStartDate.employmentStartDate", 0] },
                    departmentOrDivision: { $arrayElemAt: ["$departmentOrDivision.departmentOrDivision", 0] },
                    phone: { $arrayElemAt: ["$phone.phone", 0] },
                    employeeId: 1,
                    employeeIdNo: { $arrayElemAt: ["$employeeIdNo.employeeId", 0] },
                    fullName: { $arrayElemAt: ["$fullName.fullName", 0] },
                }
            }
        ]).exec();
        if (employeesData.length <= 0) {
            return res.status(200).json({ "message": "No employee data added yet", statuscode: 200 });
        }
        return res.status(200).json({ data: employeesData, statuscode: 200 })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 })
    }
}

export default getAllEmployees;