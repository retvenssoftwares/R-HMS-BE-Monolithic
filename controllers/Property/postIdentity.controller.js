import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import identityModel from "../../models/identityTypes.js";
import verifiedUser from "../../models/verifiedUsers.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import identityLog from "../../models/LogModels/identityLogs.js";

const userIdentity = async (req, res) => {
    try {
        const {
            userId,
            shortCode,
            identityType,
            propertyId,
            deviceType,
            ipAddress
        } = req.body;

        const authCodeValue = req.headers['authcode']
        const findUser = await verifiedUser.findOne({ userId })

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        const currentUTCTime= await getCurrentUTCTimestamp();

        if (result.success) {
            if (findUser) {

                let userRole = findUser.role[0].role
                const newIdentity = new identityModel({
                    userId,
                    shortCode: [{
                        shortCode: shortCode,
                        logId: Randomstring.generate(10)
                    }],
                    createdBy: userRole,
                    createdOn: await getCurrentUTCTimestamp(),
                    displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
                    createdOn: currentUTCTime,
                    modifiedBy: [],
                    modifiedOn: [],
                    identityType: [{
                        identityType: identityType,
                        logId: Randomstring.generate(10)
                    }],

                    propertyId,

                    identityTypeId: Randomstring.generate(8)
                });
                const savedIdentity= await newIdentity.save();
                
                // save data in logs
                const addidentityLog =new identityLog({
                    userId:savedIdentity.userId,
                    propertyId:savedIdentity.propertyId,
                    identityTypeId:savedIdentity.identityTypeId,
                    createdBy:savedIdentity.createdBy,
                    createdOn:savedIdentity.createdOn,
                    shortCode: [{
                        logId:savedIdentity.shortCode[0].logId,
                        shortCode: savedIdentity.shortCode[0].shortCode,
                        userId: userId,
                        deviceType: deviceType,
                        ipAddress:ipAddress,
                        modifiedOn: currentUTCTime,                 
                       }],
                       identityType: [{
                        logId:savedIdentity.identityType[0].logId,
                        identityType: savedIdentity.identityType[0].identityType,
                        userId: userId,
                        deviceType: deviceType,
                        ipAddress:ipAddress,
                        modifiedOn: currentUTCTime,   
                    }],
                    
                })

                await addidentityLog.save()

                return res.status(200).json({ message: "New identity added successfully", statuscode: 200 });
            } else {
                return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default userIdentity;
