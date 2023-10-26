
import Randomstring from "randomstring";
import requestIp from "request-ip"
import discountPlanModel from "../../models/discountPlan.js";
import discountPlanLogsModel from "../../models/LogModels/discountPlanLogs.js";
import { getCurrentUTCTimestamp, verifyUser } from "../../helpers/helper.js"
const createDiscountPlan = async (req, res) => {
    try {


        const { userId } = req.query
        const {
            propertyId,
            discountName,
            shortCode,
            discountType,
            discountPercent,
            discountPrice,
            validityPeriodFrom,
            validityPeriodTo,
            blackOutDates,
            applicableOn,
            deviceType
        } = req.body;


        const authCodeValue = req.headers['authcode']
        const result = await verifyUser(userId, authCodeValue)
        if (result.success) {
            const discountNameObj = {
                discountName: discountName,
                logId: Randomstring.generate(10)
            };
            const shortCodeObj = {
                shortCode: shortCode,
                logId: Randomstring.generate(10)
            };
            const discountTypeObj = {
                discountType: discountType,
                logId: Randomstring.generate(10)
            };
            const discountPercentObj = {
                discountPercent: discountPercent,
                logId: Randomstring.generate(10)
            };
            const discountPriceObj = {
                discountPrice: discountPrice,
                logId: Randomstring.generate(10)
            };
            const validityPeriodFromObj = {
                validityPeriodFrom: validityPeriodFrom,
                logId: Randomstring.generate(10)
            };
            const validityPeriodToObj = {
                validityPeriodTo: validityPeriodTo,
                logId: Randomstring.generate(10)
            };

            var clientIp = requestIp.getClientIp(req)

            const blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());
            const discountPlanId = Randomstring.generate(8)
            const discountPlan = new discountPlanModel({
                propertyId: propertyId,
                discountName: discountNameObj,
                discountPlanId: discountPlanId,
                shortCode: shortCodeObj,
                discountType: discountTypeObj,
                discountPercent: discountPercentObj,
                discountPrice: discountPriceObj,
                validityPeriodFrom: validityPeriodFromObj,
                validityPeriodTo: validityPeriodToObj,
                blackOutDates: [{ blackOutDates: blackOutDatesArray, logId: Randomstring.generate(10) }],
                applicableOn: [{ applicableOn: applicableOn, logId: Randomstring.generate(10) }]
            });

            // Create an object to represent the entire request
            const requestData = {
                body: req.body,
                // headers: req.headers
            };
            const requestDataString = JSON.stringify(requestData)


            const savedDiscountPlan = await discountPlan.save();

            // Create an object to represent the entire response
            const responseData = {
                message: "Discount rate plan created",
                statuscode: res.statusCode,
            };
            const responseString = JSON.stringify(responseData)

            const utcTime = await getCurrentUTCTimestamp()
            const discountPlanLogs = new discountPlanLogsModel({
                propertyId: propertyId,
                discountPlanId: discountPlanId,
                discountName: [{
                    logId: savedDiscountPlan.discountName[0].logId,
                    discountName: discountName,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                shortCode: [{
                    logId: savedDiscountPlan.shortCode[0].logId,
                    shortCode: shortCode,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                discountType: [{
                    logId: savedDiscountPlan.discountType[0].logId,
                    discountType: discountType,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                discountPercent: [{
                    logId: savedDiscountPlan.discountPercent[0].logId,
                    discountPercent: discountPercent,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                discountPrice: [{
                    logId: savedDiscountPlan.discountPrice[0].logId,
                    discountPrice: discountPrice,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                validityPeriodFrom: [{
                    logId: savedDiscountPlan.validityPeriodFrom[0].logId,
                    validityPeriodFrom: validityPeriodFrom,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                validityPeriodTo: [{
                    logId: savedDiscountPlan.validityPeriodTo[0].logId,
                    validityPeriodTo: validityPeriodTo,
                    userId: userId,
                    modifiedDate: utcTime,
                    ipAddress: clientIp,
                    deviceType: deviceType,
                }],
                blackOutDates: [{
                    logId: savedDiscountPlan.blackOutDates[0].logId,
                    request: requestDataString,
                    response: responseString
                }],
                applicableOn: [{
                    logId: savedDiscountPlan.applicableOn[0].logId,
                    request: requestDataString,
                    response: responseString
                }]
            });

            await discountPlanLogs.save();

            return res.status(200).json({ message: "Discount rate plan created", statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }

};

export default createDiscountPlan;
