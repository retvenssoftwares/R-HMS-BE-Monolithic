// import Randomstring from "randomstring";
// import discountPlanModel from "../../models/discountPlan.js";
// import discountPlanLogsModel from "../../models/LogModels/discountPlanLogs.js";

// const createDiscountPlan = async (req, res) => {
//     try {
//         const { discountName,
//             shortCode,
//             discountType,
//             discountPercent,
//             discountPrice,
//             validityPeriodFrom,
//             validityPeriodTo,
//             blackOutDates,
//             applicableOn,
//         data } = req.body

//         const discountNameObj = {
//             discountName: discountName,
//             logId: Randomstring.generate(10)
//         }
//         const shortCodeObj = {
//             shortCode: shortCode,
//             logId: Randomstring.generate(10)
//         }
//         const discountTypeObj = {
//             discountType: discountType,
//             logId: Randomstring.generate(10)
//         }
//         const discountPercentObj = {
//             discountPercent: discountPercent,
//             logId: Randomstring.generate(10)
//         }
//         const discountPriceObj = {
//             discountPrice: discountPrice,
//             logId: Randomstring.generate(10)
//         }
//         const validityPeriodFromObj = {
//             validityPeriodFrom: validityPeriodFrom,
//             logId: Randomstring.generate(10)
//         }
//         const validityPeriodToObj = {
//             validityPeriodTo: validityPeriodTo,
//             logId: Randomstring.generate(10)
//         }


//         const blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());

//         const discountPlan = new discountPlanModel({
//             discountName: discountNameObj,
//             shortCode: shortCodeObj,
//             discountType: discountTypeObj,
//             discountPercent: discountPercentObj,
//             discountPrice: discountPriceObj,
//             validityPeriodFrom: validityPeriodFromObj,
//             validityPeriodTo: validityPeriodToObj,
//             blackOutDates: [{ blackOutDates: blackOutDatesArray, logId: Randomstring.generate(10) }],
//             applicableOn: [{applicableOn}]
//         });

//         const discountPlanLogs = new discountPlanLogsModel({
//             propertyId : req.body.propertyId,
//             data
//         })

//         await discountPlanLogs.save();
//         await discountPlan.save();
//         return res.status(200).json({ message: "Discount rate plan created", statuscode: 200 });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
//     }

// }

// export default createDiscountPlan;

import Randomstring from "randomstring";
import discountPlanModel from "../../models/discountPlan.js";
import discountPlanLogsModel from "../../models/LogModels/discountPlanLogs.js";

const createDiscountPlan = async (req, res) => {
    try {
        const {
            discountName,
            shortCode,
            discountType,
            discountPercent,
            discountPrice,
            validityPeriodFrom,
            validityPeriodTo,
            blackOutDates,
            applicableOn,
        } = req.body;

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

        const blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());

        const discountPlan = new discountPlanModel({
            discountName: discountNameObj,
            shortCode: shortCodeObj,
            discountType: discountTypeObj,
            discountPercent: discountPercentObj,
            discountPrice: discountPriceObj,
            validityPeriodFrom: validityPeriodFromObj,
            validityPeriodTo: validityPeriodToObj,
            blackOutDates: [{ blackOutDates: blackOutDatesArray, logId: Randomstring.generate(10) }],
            applicableOn: [applicableOn]
        });

        // Create an object to represent the entire request
        const requestData = {
            body: req.body,
            headers: req.headers, // If needed, you can include headers
            // Add other request data you want to store
        };
        const requestDataString = JSON.stringify(requestData)
        // Capture the initial response data
        const initialResponse = res.json.bind(res);
        let capturedResponse = null;

        res.json = (data) => {
            capturedResponse = data;
            initialResponse(data);
        };

        await discountPlan.save();

        // Create an object to represent the entire response
        const responseData = {
            message: res.statusMessage, // Store the response message
            statuscode: res.statusCode, // Store the response status code
            // Add other response data you want to store
        };
        const responseString = JSON.stringify(responseData)
        console.log("Response", responseString)
        console.log("Requst", requestDataString)
        const discountPlanLogs = new discountPlanLogsModel({
            propertyId: req.body.propertyId,
            data: [{
                request: requestDataString,
                response: responseString
            }]
        });

        await discountPlanLogs.save();

        return res.status(200).json({ message: "Discount rate plan created", statuscode: 200 });
    } catch (err) {
        // Create an object to represent the entire request
        const requestData = {
            body: req.body,
            headers: req.headers, // If needed, you can include headers
            // Add other request data you want to store
        };
        const requestDataString = JSON.stringify(requestData)
        const responseData = {
            message: res.statusMessage, // Store the response message
            statuscode: 500, // Store the response status code
            // Add other response data you want to store
        };
        const responseString = JSON.stringify(responseData)
        const discountPlanLogs = new discountPlanLogsModel({
            propertyId: req.body.propertyId,
            data: [{
                request: requestDataString,
                response: responseString
            }]
        });

        await discountPlanLogs.save();
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default createDiscountPlan;
