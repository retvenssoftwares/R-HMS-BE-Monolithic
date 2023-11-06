import barRatePlan from '../../models/barRatePlan.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp,findUserByUserIdAndToken } from '../../helpers/helper.js'
import barPlanLogsModel from "../../models/LogModels/barRatePlanLogs.js";
import Randomstring from "randomstring";
const patchBarRatePlan = async (req, res) => {
    try {
        const { userId, shortCode, ratePlanName, inclusion,inclusionPlan,roomBaseRate,mealCharge,inclusionCharge,roundUp,extraAdultRate,extraChildRate,ratePlanTotal} = req.body;
        const barRatePlanId = req.params.barRatePlanId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
       

     const result = await findUserByUserIdAndToken(userId, authCodeValue);
     
     if(result.success){
        const findBarRatePlan = await barRatePlan.findOne({ barRatePlanId });

        const logBarRatePlan = await barPlanLogsModel.findOne({ barRatePlanId });

        if (!findBarRatePlan || !barRatePlanId) {
            return res.status(404).json({ message: "barRatePlan not found", statuscode: 404 });
        }
     
         const shortcodeLog =Randomstring.generate(10)
         const ratePlanNameLog =Randomstring.generate(10)
         const inclusionTotalLog =Randomstring.generate(10)
         const totalRatePlanPriceLog =Randomstring.generate(10)
         const inclusionPlanLog =Randomstring.generate(10)


        const currentUTCTime = await getCurrentUTCTimestamp();

        if(shortCode){
            const shortCodeObject ={
                shortCode:shortCode,
                logId:shortcodeLog
            };
            findBarRatePlan.shortCode.unshift(shortCodeObject)

        }

        if (ratePlanName) {
            const ratePlanNameObject = {
                ratePlanName: ratePlanName,
                logId:ratePlanNameLog
            };
            findBarRatePlan.ratePlanName.unshift(ratePlanNameObject);
        }

        if (inclusionPlan) {
            const inclusionObject = {
                inclusionPlan: inclusionPlan,
                logId:inclusionPlanLog
            };
            findBarRatePlan.inclusion.unshift(inclusionObject);
        }

        if (roomBaseRate) {
            const roomBaseRateObject = {
                roomBaseRate: roomBaseRate,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.roomBaseRate.unshift(roomBaseRateObject);
        }

        if (mealCharge) {
            const mealChargeObject = {
                mealCharge: mealCharge,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.mealCharge.unshift(mealChargeObject);
        }

        if (inclusionCharge) {
            const inclusionChargeObject = {
                inclusionCharge: inclusionCharge,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.inclusionCharge.unshift(inclusionChargeObject);
        }

        if (roundUp) {
            const roundUpObject = {
                roundUp: roundUp,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.roundUp.unshift(roundUpObject);
        }

        if (extraAdultRate) {
            const extraAdultRateObject = {
                extraAdultRate: extraAdultRate,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.extraAdultRate.unshift(extraAdultRateObject);
        }

        if (extraChildRate) {
            const extraChildRateObject = {
                extraChildRate: extraChildRate,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.extraChildRate.unshift(extraChildRateObject);
        }

        if (ratePlanTotal) {
            const ratePlanTotalObject = {
                ratePlanTotal: ratePlanTotal,
                logId: Randomstring.generate(10),
            };
            findBarRatePlan.barRates.ratePlanTotal.unshift(ratePlanTotalObject);
        }



        ///
        const requestData = {
            body: req.body,
            headers: req.headers, // If needed, you can include headers
            // Add other request data you want to store
        };
        const requestDataString = JSON.stringify(requestData)

        const updatedratePlan = await findBarRatePlan.save();


        const responseData = {
            message: res.statusMessage, // Store the response message
            statuscode: res.statusCode, // Store the response status code
            // Add other response data you want to store
        };
        const responseString = JSON.stringify(responseData)

     
        ////logs data 
        if(shortCode){
            const shortCodeObject ={
                shortCode:shortCode,
                logId:shortcodeLog,
                modifiedOn:currentUTCTime,
                userId:req.body.userId
            };
            logBarRatePlan.shortCode.unshift(shortCodeObject)
        }

        if(ratePlanName){
            const ratePlanNameObject ={
                ratePlanName:ratePlanName,
                logId:ratePlanNameLog,
                modifiedOn:currentUTCTime,
                userId:req.body.userId
            };
            logBarRatePlan.ratePlanName.unshift(ratePlanNameObject)
        }

        if (inclusionPlan) {
            const inclusionObject = {
                inclusionPlan: inclusionPlan,
                logId:inclusionPlanLog,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                request: requestDataString,
                response: responseString

            };
            logBarRatePlan.inclusion.unshift(inclusionObject);
        }


      await logBarRatePlan.save();

        if (updatedratePlan) {
            return res.status(200).json({ message: "bar rate plan successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "bar rate plan not found", statuscode: 404 });
        }
    }else{
        return res.status(result.statuscode).json({ message: result.message });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchBarRatePlan;
