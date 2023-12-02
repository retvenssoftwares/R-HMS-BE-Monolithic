import randomstring from 'randomstring';
import employeeModel from "../../models/houseKeepingModel.js";
import { findUserByUserIdAndToken, getCurrentUTCTimestamp, uploadImageToS3 } from '../../helpers/helper.js';
const addEmployee = async (req, res) => {
    try {
        const { userId } = req.query;
        const { fullName, gender, dateOfBirth, propertyId, phone, email, address, idType, idNumber, expirationDate,
            nameOfEmergencyContact, relationWithEmergencyContact, emergencyContact, emergencyContactAlternate,
            designation, departmentOrDivision, employmentStartDate, employmentType } = req.body;
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        let imageUrl = ""
        let docUrl = ""
        if (req.files['profilePhoto']) {
            imageUrl = await uploadImageToS3(req.files['profilePhoto'][0]);
        }
        if (req.files['document']) {
            docUrl = await uploadImageToS3(req.files['document'][0]);
        }
        const addNewEmployee = new employeeModel({
            propertyId,
            employeeId: randomstring.generate(8),
            employeeIdNo: randomstring.generate({
                length: 5,
                charset: 'numeric'
            }),
            fullName: [{
                fullName: fullName,
                logId: randomstring.generate(10)
            }],
            gender: [{
                gender: gender,
                logId: randomstring.generate(10)
            }],
            profilePhoto: [{
                profilePhoto: imageUrl,
                logId: randomstring.generate(10)
            }],
            dateOfBirth: [{
                dateOfBirth: dateOfBirth,
                logId: randomstring.generate(10)
            }],
            phone: [{
                phone: phone,
                logId: randomstring.generate(10)
            }],
            email: [{
                email: email,
                logId: randomstring.generate(10)
            }],
            address: [{
                address: address,
                logId: randomstring.generate(10)
            }],
            idType: [{
                idType: idType,
                logId: randomstring.generate(10)
            }],
            idNumber: [{
                idNumber: idNumber,
                logId: randomstring.generate(10)
            }],
            expirationDate: [{
                expirationDate: expirationDate,
                logId: randomstring.generate(10)
            }],
            docImage: [{
                docImage: docUrl,
                logId: randomstring.generate(10)
            }],
            nameOfEmergencyContact: [{
                nameOfEmergencyContact: nameOfEmergencyContact,
                logId: randomstring.generate(10)
            }],
            relationWithEmergencyContact: [{
                relationWithEmergencyContact: relationWithEmergencyContact,
                logId: randomstring.generate(10)
            }],
            emergencyContact: [{
                emergencyContact: emergencyContact,
                logId: randomstring.generate(10)
            }],
            emergencyContactAlternate: [{
                emergencyContactAlternate: emergencyContactAlternate,
                logId: randomstring.generate(10)
            }],
            designation: [{
                designation: designation,
                logId: randomstring.generate(10)
            }],
            departmentOrDivision: [{
                departmentOrDivision: departmentOrDivision,
                logId: randomstring.generate(10)
            }],
            employmentStartDate: [{
                employmentStartDate: employmentStartDate,
                logId: randomstring.generate(10)
            }],
            employmentType: [{
                employmentType: employmentType,
                logId: randomstring.generate(10)
            }],
            createdOn: await getCurrentUTCTimestamp()
        })

        await addNewEmployee.save();
        return res.status(200).json({ message: "Employee added successfully", statuscode: 200 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default addEmployee