import randomstring from 'randomstring'
import mealPlan from '../../models/mealPlan.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from '../../helpers/helper.js'
import mealPLanLog from '../../models/LogModels/mealPlanLogs.js'

const patchMealPlan = async (req, res) => {
    try {
        const { shortCode ,mealPlanName,chargesPerOccupancy, displayStatus,deviceType,ipAddress } = req.body;
        const { mealPlanId, userId } = req.query;
        const findUser = await verifiedUser.findOne({ userId: userId});
        const userid=findUser.userId;

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            let userRole = findUser.role[0].role;


            const findMealPlan= await mealPlan.findOne({ mealPlanId });

            if (!findMealPlan || !mealPlanId) {
                return res.status(404).json({ message: "meal plan not found", statuscode: 404 });
            }

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomstring.generate(10)
                };
                findMealPlan.shortCode.unshift(shortCodeObject);
            }

            if (mealPlanName) {
                const mealPLanNameObject = {
                    mealPlanName: mealPlanName,
                    logId: randomstring.generate(10)
                };
                findMealPlan.mealPlanName.unshift(mealPLanNameObject);
            }

            if (chargesPerOccupancy) {
                const chargesPerOccupancyObject = {
                    chargesPerOccupancy: chargesPerOccupancy,
                    logId: randomstring.generate(10)
                };
                findMealPlan.chargesPerOccupancy.unshift(chargesPerOccupancyObject);
            }
            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: randomstring.generate(10)
                };
                findMealPlan.displayStatus.unshift(displayStatusObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: randomstring.generate(10)
            };

            findMealPlan.modifiedBy.unshift(modifiedByObject);
            var currentUTCTime = await getCurrentUTCTimestamp()
            findMealPlan.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: randomstring.generate(10) });

            const updatedMealPlan = await findMealPlan.save();

            if (updatedMealPlan) {

                //save data in logs

                const findMealPlanLog=await mealPLanLog.findOne({mealPlanId})
                if (findMealPlanLog){
                    if (shortCode) {
                        const shortCodeObject = {
                            shortCode: updatedMealPlan.shortCode[0].shortCode,
                            logId: updatedMealPlan.shortCode[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findMealPlanLog.shortCode.unshift(shortCodeObject);
                    }
                    if (mealPlanName) {
                        const mealPlanNameObject = {
                            mealPlanName: updatedMealPlan.mealPlanName[0].mealPlanName,
                            logId: updatedMealPlan.mealPlanName[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findMealPlanLog.mealPlanName.unshift(mealPlanNameObject);
                    }
                    if (chargesPerOccupancy) {
                        const chargesPerOccupancyObject = {
                            chargesPerOccupancy: updatedMealPlan.chargesPerOccupancy[0].chargesPerOccupancy,
                            logId: updatedMealPlan.chargesPerOccupancy[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findMealPlanLog.chargesPerOccupancy.unshift(chargesPerOccupancyObject);
                    }
                    if (displayStatus) {
                        const displayStatusObject = {
                            displayStatus: updatedMealPlan.displayStatus[0].displayStatus,
                            logId: updatedMealPlan.displayStatus[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findMealPlanLog.displayStatus.unshift(displayStatusObject);
                    }
                }

                await findMealPlanLog.save();
                return res.status(200).json({ message: "Meal Plan successfully updated", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
       
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchMealPlan;
