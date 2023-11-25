import Randomstring from "randomstring"
import requestIp from "request-ip"
import verifiedUser from '../../models/verifiedUsers.js'
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";
import discountPlanModel from "../../models/discountPlan.js";
import discountPlanLogModel from "../../models/LogModels/discountPlanLogs.js";

const editDiscountPlan = async (req, res) => {
    try {
        const {userId, discountName, shortCode, deviceType, discountType, discountPercent, blackOutDates, discountPrice, validityPeriodFrom, validityPeriodTo,discountTotal,extraAdultRate,extraChildRate,ratePlanInclusion,displayStatus,ipAddress } = req.body
        const {  discountPlanId } = req.params
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        
        if (result.success) {
              //add validations
        const findDiscountPlan = await discountPlanModel.findOne({ discountPlanId })

        const findDiscountPlanLogs = await discountPlanLogModel.findOne({ discountPlanId })
        if (!findDiscountPlan || !findDiscountPlanLogs ) {
            return res.status(400).json({ message: "Invalid discountPlanId" })
        }
        const currentUTCTime = await getCurrentUTCTimestamp();
      

        if(discountName){
            const discountNameObject ={
                discountName:discountName,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.discountName.unshift(discountNameObject)
        }
        if(shortCode){
            const shortCodeObject ={
                shortCode:shortCode,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.shortCode.unshift(shortCodeObject)
        }
        if(discountType){
            const discountTypeObject ={
                discountType:discountType,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.discountType.unshift(discountTypeObject)
        }

        if(displayStatus){
            const displayStatusObject ={
                displayStatus:displayStatus,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.displayStatus.unshift(displayStatusObject)
        }

        if(discountPercent){
            const discountPercentObject ={
                discountPercent:discountPercent,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.discountPercent.unshift(discountPercentObject)
        }

        if(discountPrice){
            const discountPriceObject ={
                discountPrice:discountPrice,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.discountPrice.unshift(discountPriceObject)
        }
 // Check for blackOutDates existence and validity
  const blackOutDatesArray = [];
 if (blackOutDates && Array.isArray(blackOutDates)) {
     blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());
 }
        if(blackOutDatesArray){
            const blackOutDatesObject ={
                blackOutDates:blackOutDatesArray,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.blackOutDates.unshift(blackOutDatesObject)
        }

        if(validityPeriodFrom){
            const validityPeriodFromObject ={
                validityPeriodFrom:validityPeriodFrom,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.validityPeriodFrom.unshift(validityPeriodFromObject)
        }

        if(validityPeriodTo){
            const validityPeriodToObject ={
                validityPeriodTo:validityPeriodTo,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.validityPeriodTo.unshift(validityPeriodToObject)
        }


        if (ratePlanInclusion) {
            const inclusionObject = {
                ratePlanInclusion: ratePlanInclusion,
                logId:Randomstring.generate(10),
            };
            findDiscountPlan.ratePlanInclusion.unshift(inclusionObject);
        }

        if (extraAdultRate) {
            const extraAdultRateObject = {
                extraAdultRate: extraAdultRate,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.barRates.extraAdultRate.unshift(extraAdultRateObject);
        }

        if (extraChildRate) {
            const extraChildRateObject = {
                extraChildRate: extraChildRate,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.barRates.extraChildRate.unshift(extraChildRateObject);
        }

        if (discountTotal) {
            const discountTotalObject = {
                discountTotal: discountTotal,
                logId: Randomstring.generate(10),
            };
            findDiscountPlan.barRates.discountTotal.unshift(discountTotalObject);
        }


          ////////////
          const requestData = {
            body: req.body,
           // headers: req.headers, // If needed, you can include headers
            // Add other request data you want to store
        };
        const requestDataString = JSON.stringify(requestData)

        const updatedratePlan = await findDiscountPlan.save();


        const responseData = {
            message: "inclusion plan updated",
            statuscode: res.statusCode,
               // Store the response message
              // Store the response status code
            // Add other response data you want to store
        };
        const responseString = JSON.stringify(responseData)

     

        ///save log
        if(discountName){
            const discountNameObject ={
                discountName:discountName,
                logId:updatedratePlan.discountName[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.discountName.unshift(discountNameObject)
        }
        if(shortCode){
            const shortCodeObject ={
                shortCode:shortCode,
                logId:updatedratePlan.shortCode[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.shortCode.unshift(shortCodeObject)
        }
        if(discountType){
            const discountTypeObject ={
                discountType:discountType,
                logId:updatedratePlan.discountType[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.discountType.unshift(discountTypeObject)
        }

        if(discountPercent){
            const discountPercentObject ={
                discountPercent:discountPercent,
                logId:updatedratePlan.discountPercent[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.discountPercent.unshift(discountPercentObject)
        }

        if(discountPrice){
            const discountPriceObject ={
                discountPrice:discountPrice,
                logId:updatedratePlan.discountPrice[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.discountPrice.unshift(discountPriceObject)
        }

        if(blackOutDatesArray){
            const blackOutDatesObject ={
                blackOutDates:blackOutDatesArray,
                logId:updatedratePlan.blackOutDates[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                request: requestDataString,
                response: responseString,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.blackOutDates.unshift(blackOutDatesObject)
        }

        if(validityPeriodFrom){
            const validityPeriodFromObject ={
                validityPeriodFrom:validityPeriodFrom,
                logId:updatedratePlan.validityPeriodFrom[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.validityPeriodFrom.unshift(validityPeriodFromObject)
        }

        if(validityPeriodTo){
            const validityPeriodToObject ={
                validityPeriodTo:validityPeriodTo,
                logId:updatedratePlan.validityPeriodTo[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.validityPeriodTo.unshift(validityPeriodToObject)
        }

        if(displayStatus){
            const displayStatusObject ={
                displayStatus:displayStatus,
                logId:updatedratePlan.displayStatus[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.displayStatus.unshift(displayStatusObject)
        }

        if (ratePlanInclusion) {
            const inclusionObject = {
                ratePlanInclusion: ratePlanInclusion,
                logId:updatedratePlan.ratePlanInclusion[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                request: requestDataString,
                response: responseString,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.ratePlanInclusion.unshift(inclusionObject);
        }

        if (extraAdultRate) {
            const extraAdultRateObject = {
                extraAdultRate: extraAdultRate,
                logId:updatedratePlan.barRates.extraAdultRate[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.barRates.extraAdultRate.unshift(extraAdultRateObject);
        }

        if (extraChildRate) {
            const extraChildRateObject = {
                extraChildRate: extraChildRate,
                logId:updatedratePlan.barRates.extraChildRate[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.barRates.extraChildRate.unshift(extraChildRateObject);
        }

        if (discountTotal) {
            const discountTotalObject = {
                discountTotal: discountTotal,
                logId:updatedratePlan.barRates.discountTotal[0].logId,
                modifiedOn:currentUTCTime,
                userId:req.body.userId,
                deviceType:deviceType,
                ipAddress:ipAddress
            };
            findDiscountPlanLogs.barRates.discountTotal.unshift(discountTotalObject);
        }
             
           
        await findDiscountPlanLogs.save();

            return res.status(200).json({ message: "Rate plan updated successfully" })

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default editDiscountPlan;