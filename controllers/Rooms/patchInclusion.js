import Randomstring from 'randomstring'
import inclusion from '../../models/inclusion.js'
import verifiedUser from '../../models/verifiedUsers.js'
 import { getCurrentUTCTimestamp,findUserByUserIdAndToken } from '../../helpers/helper.js'
 import inclusionLog from '../../models/LogModels/inclusionLog.js'

const patchInclusion = async (req, res) => {
    try {
         const {userId,inclusionId} =req.query;
        const {  inclusionName,shortCode,postingRule,charge,chargeRule, inclusionType,displayStatus,deviceType,ipAddress} = req.body;
        const authCodeValue = req.headers['authcode'];

        const findUser = await verifiedUser.findOne({ userId });
        const userid = findUser.userId;
        
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })   
        }
        let userRole = findUser.role[0].role;
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const currentUTCTime = await getCurrentUTCTimestamp();
   if(result.success){
        const findInclusion = await inclusion.findOne({ inclusionId : inclusionId});

        if (!findInclusion || !inclusionId) {
            return res.status(404).json({ message: "Inclusion not found", statuscode: 404 });
        }
        
        if (shortCode) {
            const shortCodeObject = {
                shortCode: shortCode,
                logId:Randomstring.generate(10)
            };
            findInclusion.shortCode.unshift(shortCodeObject);
        }
        if (inclusionName) {
            const inclusionNameObject = {
                inclusionName: inclusionName,
                logId:Randomstring.generate(10)
            };
            findInclusion.inclusionName.unshift(inclusionNameObject);
        }
        
        if (inclusionType) {
            const inclusionTypeObject = {
                inclusionType: inclusionType,
                logId:Randomstring.generate(10)
            };
            findInclusion.inclusionType.unshift(inclusionTypeObject);
        }
        if (postingRule) {
            const postingRuleObject = {
                postingRule: postingRule,
                logId:Randomstring.generate(10)
            };
            findInclusion.postingRule.unshift(postingRuleObject);
        }
        if (charge) {
            const chargeObject = {
                charge: charge,
                logId:Randomstring.generate(10)
            };
            findInclusion.charge.unshift(chargeObject);
        }
        if (chargeRule) {
            const chargeRuleObject = {
                chargeRule: chargeRule,
                logId:Randomstring.generate(10)
            };
            findInclusion.chargeRule.unshift(chargeRuleObject);
        }
        if (displayStatus) {
            const displayStatusObject = {
                displayStatus: displayStatus,
                logId: Randomstring.generate(10)
            };
            findInclusion.displayStatus.unshift(displayStatusObject);
        }

        const modifiedByObject = {
            modifiedBy: userRole,
            logId:Randomstring.generate(10)
        };

        findInclusion.modifiedBy.unshift(modifiedByObject);
        findInclusion.modifiedOn.unshift({ modifiedOn: currentUTCTime,logId:Randomstring.generate(10) });
       
        const updatedInclusion = await findInclusion.save();

        if (updatedInclusion) {

            //save data in logs
            const findInclusionLogs = await inclusionLog.findOne({inclusionId})
            if(findInclusionLogs){
                if (shortCode) {
                    const shortCodeObject = {
                        shortCode:updatedInclusion.shortCode[0].shortCode,
                        logId:updatedInclusion.shortCode[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.shortCode.unshift(shortCodeObject);
                }
                if (displayStatus) {
                    const displayStatusObject = {
                        displayStatus:updatedInclusion.displayStatus[0].displayStatus,
                        logId:updatedInclusion.displayStatus[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.displayStatus.unshift(displayStatusObject);
                }
                if (inclusionName) {
                    const inclusionNameObject = {
                        inclusionName:updatedInclusion.inclusionName[0].inclusionName,
                        logId:updatedInclusion.inclusionName[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.inclusionName
                    .unshift(inclusionNameObject);
                }
                if (inclusionType) {
                    const inclusionTypeObject = {
                        inclusionType:updatedInclusion.inclusionType[0].inclusionType,
                        logId:updatedInclusion.inclusionType[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.inclusionType.unshift(inclusionTypeObject);
                }
                if (postingRule) {
                    const postingRuleObject = {
                        postingRule:updatedInclusion.postingRule[0].postingRule,
                        logId:updatedInclusion.postingRule[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.postingRule.unshift(postingRuleObject);
                }
                if (charge) {
                    const chargeObject = {
                        charge:updatedInclusion.charge[0].charge,
                        logId:updatedInclusion.charge[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.charge.unshift(chargeObject);
                }
                if (chargeRule) {
                    const chargeRuleObject = {
                        chargeRule:updatedInclusion.chargeRule[0].chargeRule,
                        logId:updatedInclusion.chargeRule[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findInclusionLogs.chargeRule.unshift(chargeRuleObject);
                }
            }
            await findInclusionLogs.save();

            return res.status(200).json({ message: "Inclusion successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "Inclusion not found", statuscode: 404 });
        } 

    }
    else{
        return res.status(result.statuscode).json({ message: result.message });
    }
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchInclusion;