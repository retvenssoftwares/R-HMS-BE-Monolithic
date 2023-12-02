import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";
import employeeModel from "../../models/houseKeepingModel.js";

const fetchEmployeeById = async (req, res) => {

    try {
        const { employeeId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const findEmployee = await employeeModel.findOne({ employeeId }, '-_id').lean();
        if (!findEmployee) {
            return res.status(404).json({ message: "Please enter valid employeeId", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            if (findEmployee) {
                const employeeData = {
                    ...findEmployee._doc,
                    employeeId: employeeId,
                    propertyId: findEmployee.propertyId || '',
                    profilePhoto: findEmployee.profilePhoto[0].profilePhoto || '',
                    fullName: findEmployee.fullName[0].fullName || '',
                    gender: findEmployee.gender[0].gender || '',
                    dateOfBirth: findEmployee.dateOfBirth[0].dateOfBirth || '',
                    phone: findEmployee.phone[0].phone || '',
                    email: findEmployee.email[0].email || "",
                    address: findEmployee.address[0].address || "",
                    idType: findEmployee.idType[0].idType || "",
                    idNumber: findEmployee.idNumber[0].idNumber || "",
                    expirationDate: findEmployee.expirationDate[0].expirationDate || "",
                    docImage: findEmployee.docImage[0].docImage || "",
                    relationWithEmergencyContact: findEmployee.relationWithEmergencyContact[0].relationWithEmergencyContact || "",
                    nameOfEmergencyContact: findEmployee.nameOfEmergencyContact[0].nameOfEmergencyContact || "",
                    emergencyContact: findEmployee.emergencyContact.length > 0 ? findEmployee.emergencyContact[0].emergencyContact : "",
                    emergencyContactAlternate: findEmployee.emergencyContactAlternate.length > 0 ? findEmployee.emergencyContactAlternate[0].emergencyContactAlternate : "",
                    designation: findEmployee.designation.length > 0 ? findEmployee.designation[0].designation : "",
                    departmentOrDivision: findEmployee.departmentOrDivision.length > 0 ? findEmployee.departmentOrDivision[0].departmentOrDivision : "",
                    employmentStartDate: findEmployee.employmentStartDate[0].employmentStartDate || '',
                    employmentType: findEmployee.employmentType[0].employmentType || ''
                };
                return res.status(200).json({ data: employeeData, statuscode: 200 })
            } else {
                return res.status(200).json({ message: "No employee details found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};

export default fetchEmployeeById;
