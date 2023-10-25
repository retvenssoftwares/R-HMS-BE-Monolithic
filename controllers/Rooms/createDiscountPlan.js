
import Randomstring from "randomstring";
import requestIp from "request-ip"
import discountPlanModel from "../../models/discountPlan.js";
import discountPlanLogsModel from "../../models/LogModels/discountPlanLogs.js";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js"
const createDiscountPlan = async (req, res) => {
    try {
        const logId = Randomstring.generate(10);
        const {
            propertyId,
            userId,
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

        const discountNameObj = {
            discountName: discountName,
            logId: logId
        };
        const shortCodeObj = {
            shortCode: shortCode,
            logId: logId
        };
        const discountTypeObj = {
            discountType: discountType,
            logId: logId
        };
        const discountPercentObj = {
            discountPercent: discountPercent,
            logId: logId
        };
        const discountPriceObj = {
            discountPrice: discountPrice,
            logId: logId
        };
        const validityPeriodFromObj = {
            validityPeriodFrom: validityPeriodFrom,
            logId: logId
        };
        const validityPeriodToObj = {
            validityPeriodTo: validityPeriodTo,
            logId: logId
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
            applicableOn: [{ applicableOn: applicableOn }]
        });

        // Create an object to represent the entire request
        const requestData = {
            body: req.body,
            headers: req.headers
        };
        const requestDataString = JSON.stringify(requestData)


        await discountPlan.save();

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
                logId: logId,
                discountName: discountName,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            shortCode: [{
                logId: logId,
                shortCode: shortCode,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            discountType: [{
                logId: logId,
                discountType: discountType,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            discountPercent: [{
                logId: logId,
                discountPercent: discountPercent,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            discountPrice: [{
                logId: logId,
                discountPrice: discountPrice,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            validityPeriodFrom: [{
                logId: logId,
                validityPeriodFrom: validityPeriodFrom,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            validityPeriodTo: [{
                logId: logId,
                validityPeriodTo: validityPeriodTo,
                userId: userId,
                modifiedDate: utcTime,
                ipAddress: clientIp,
                deviceType: deviceType,
            }],
            data: [{
                request: requestDataString,
                response: responseString
            }]
        });

        await discountPlanLogs.save();

        return res.status(200).json({ message: "Discount rate plan created", statuscode: 200 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default createDiscountPlan;
