import randomString from 'randomstring'
import identityTypeModel from '../../models/identityTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import identityLog from '../../models/LogModels/identityLogs.js'


const patchIdentityType = async (req, res) => {

    try {
        const { userId } = req.query
        const { shortCode, identityType,deviceType,ipAddress } = req.body;
        const identityTypeId = req.query.identityTypeId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });
        const userid=findUser.userId
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }
        let userRole = findUser.role[0].role;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {

            const findIdentityType = await identityTypeModel.findOne({ identityTypeId: identityTypeId });

            if (!findIdentityType || !identityTypeId) {
                return res.status(404).json({ message: "Identity type not found", statuscode: 404 });
            }

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomString.generate(10)
                };
                findIdentityType.shortCode.unshift(shortCodeObject);
            }
            const currentUTCTime = await getCurrentUTCTimestamp();

            if (identityType) {
                const identityTypeObject = {
                    identityType: identityType,
                    logId: randomString.generate(10)
                };
                findIdentityType.identityType.unshift(identityTypeObject);
            }
            const modifiedByObject = {
                modifiedBy: userRole,
                logId: randomString.generate(10)
            };

            findIdentityType.modifiedBy.unshift(modifiedByObject);
            findIdentityType.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: randomString.generate(10) });
            const updatedIdentityType = await findIdentityType.save();

            if (updatedIdentityType) {

                //save data in logs

                const findIdentityLog = await identityLog.findOne({identityTypeId });

                if (findIdentityLog){
                if (shortCode) {
                    const shortCodeObject = {
                        shortCode:updatedIdentityType.shortCode[0].shortCode,
                        logId:updatedIdentityType.shortCode[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findIdentityLog.shortCode.unshift(shortCodeObject);
                }

                if (identityType) {
                    const identityTypeObject = {
                        identityType:updatedIdentityType.identityType[0].identityType,
                        logId:updatedIdentityType.identityType[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findIdentityLog.identityType.unshift(identityTypeObject);
                }
        
            }
            await findIdentityLog.save();

                return res.status(200).json({ message: "Identity type successfully updated", statuscode: 200 });

            } else {
                return res.status(404).json({ message: "identity not found", statuscode: 404 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchIdentityType;