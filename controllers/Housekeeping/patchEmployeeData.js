import randomstring from 'randomstring'
import employeeModel from "../../models/houseKeepingModel.js";
import { findUserByUserIdAndToken, uploadImageToS3 } from '../../helpers/helper.js';

const editEmployeeDetails = async (req, res) => {
    try {
        const { userId, propertyId, employeeId } = req.query;
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        let imageUrl = ''
        let docUrl = ''
        if (req.files["profilePhoto"]) {
            imageUrl = await uploadImageToS3(req.files['profilePhoto'][0]);
            const update = {
                $push: {
                    profilePhoto: {
                        $each: [{
                            profilePhoto: imageUrl,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.files["document"]) {
            docUrl = await uploadImageToS3(req.files['document'][0]);
            const update = {
                $push: {
                    docImage: {
                        $each: [{
                            docImage: docUrl,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.employeeIdNo) {
            const update = {
                $push: {
                    employeeIdNo: {
                        $each: [{
                            employeeIdNo: req.body.employeeIdNo,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.fullName) {
            const update = {
                $push: {
                    fullName: {
                        $each: [{
                            fullName: req.body.fullName,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.gender) {
            const update = {
                $push: {
                    gender: {
                        $each: [{
                            gender: req.body.gender,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.dateOfBirth) {
            const update = {
                $push: {
                    dateOfBirth: {
                        $each: [{
                            dateOfBirth: req.body.dateOfBirth,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.phone) {
            const update = {
                $push: {
                    phone: {
                        $each: [{
                            phone: req.body.phone,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.email) {
            const update = {
                $push: {
                    email: {
                        $each: [{
                            email: req.body.email,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.address) {
            const update = {
                $push: {
                    address: {
                        $each: [{
                            address: req.body.address,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.idType) {
            const update = {
                $push: {
                    idType: {
                        $each: [{
                            idType: req.body.idType,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.idNumber) {
            const update = {
                $push: {
                    idNumber: {
                        $each: [{
                            idNumber: req.body.idNumber,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.expirationDate) {
            const update = {
                $push: {
                    expirationDate: {
                        $each: [{
                            expirationDate: req.body.expirationDate,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.nameOfEmergencyContact) {
            const update = {
                $push: {
                    nameOfEmergencyContact: {
                        $each: [{
                            nameOfEmergencyContact: req.body.nameOfEmergencyContact,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.relationWithEmergencyContact) {
            const update = {
                $push: {
                    relationWithEmergencyContact: {
                        $each: [{
                            relationWithEmergencyContact: req.body.relationWithEmergencyContact,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.emergencyContact) {
            const update = {
                $push: {
                    emergencyContact: {
                        $each: [{
                            emergencyContact: req.body.emergencyContact,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.emergencyContactAlternate) {
            const update = {
                $push: {
                    emergencyContactAlternate: {
                        $each: [{
                            emergencyContactAlternate: req.body.emergencyContactAlternate,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.designation) {
            const update = {
                $push: {
                    designation: {
                        $each: [{
                            designation: req.body.designation,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.departmentOrDivision) {
            const update = {
                $push: {
                    departmentOrDivision: {
                        $each: [{
                            departmentOrDivision: req.body.departmentOrDivision,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.employmentStartDate) {
            const update = {
                $push: {
                    employmentStartDate: {
                        $each: [{
                            employmentStartDate: req.body.employmentStartDate,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        if (req.body.employmentType) {
            const update = {
                $push: {
                    employmentType: {
                        $each: [{
                            employmentType: req.body.employmentType,
                            logId: randomstring.generate(10)
                        }],
                        $position: 0
                    }
                }
            };
            await employeeModel.findOneAndUpdate({ propertyId: propertyId, employeeId: employeeId }, update, {
                new: true
            });
        }

        return res.status(200).json({ message: "Employee data successfully updated", statuscode: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 });
    }
}

export default editEmployeeDetails