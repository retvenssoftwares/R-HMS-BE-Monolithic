import Randomstring from "randomstring"
import requestIp from "request-ip"
import { findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";
import discountPlanModel from "../../models/discountPlan.js";
import discountPlanLogModel from "../../models/LogModels/discountPlanLogs.js";

const editDiscountPlan = async (req, res) => {
    try {
        var clientIp = requestIp.getClientIp(req)
        const { userId, discountPlanId } = req.query

        //add validations
        const findDiscountPlan = await discountPlanModel.findOne({ discountPlanId })
        const findDiscountPlanLogs = await discountPlanLogModel.findOne({ discountPlanId })
        if (!findDiscountPlan || !findDiscountPlanLogs || !discountPlanId) {
            return res.status(400).json({ message: "Invalid discountPlanId" })
        }
        const { discountName, shortCode, deviceType, discountType, discountPercent, blackOutDates, applicableOn, discountPrice, validityPeriodFrom, validityPeriodTo } = req.body
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {

            //edit fields
            if (discountName) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        discountName: {
                            $each: [{
                                discountName: discountName,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };
                const update2 = {
                    $push: {
                        discountName: {
                            $each: [{
                                logId: logId,
                                discountName: discountName,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updatedDiscountName = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updatedDiscountNameLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (shortCode) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        shortCode: {
                            $each: [{
                                shortCode: shortCode,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };

                const update2 = {
                    $push: {
                        shortCode: {
                            $each: [{
                                logId: logId,
                                shortCode: shortCode,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updatedShortCode = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updatedShortCodeLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (discountType) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        discountType: {
                            $each: [{
                                discountType: discountType,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };

                const update2 = {
                    $push: {
                        discountType: {
                            $each: [{
                                logId: logId,
                                discountType: discountType,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updatedDiscountType = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updatedDiscountTypeLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (discountPercent) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        discountPercent: {
                            $each: [{
                                discountPercent: discountPercent,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };

                const update2 = {
                    $push: {
                        discountPercent: {
                            $each: [{
                                logId: logId,
                                discountPercent: discountPercent,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updateddiscountPercent = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updateddiscountPercentLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (discountPrice) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        discountPrice: {
                            $each: [{
                                discountPrice: discountPrice,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };

                const update2 = {
                    $push: {
                        discountPrice: {
                            $each: [{
                                logId: logId,
                                discountPrice: discountPrice,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updateddiscountPrice = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updateddiscountPriceLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (validityPeriodFrom) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        validityPeriodFrom: {
                            $each: [{
                                validityPeriodFrom: validityPeriodFrom,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };

                const update2 = {
                    $push: {
                        validityPeriodFrom: {
                            $each: [{
                                logId: logId,
                                validityPeriodFrom: validityPeriodFrom,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updatedvalidityPeriodFrom = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updatedvalidityPeriodFromLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (validityPeriodTo) {
                const logId = Randomstring.generate(10)
                const update1 = {
                    $push: {
                        validityPeriodTo: {
                            $each: [{
                                validityPeriodTo: validityPeriodTo,
                                logId: logId
                            }],
                            $position: 0
                        }
                    }
                };

                const update2 = {
                    $push: {
                        validityPeriodTo: {
                            $each: [{
                                logId: logId,
                                validityPeriodTo: validityPeriodTo,
                                userId: userId,
                                modifiedDate: await getCurrentUTCTimestamp(),
                                ipAddress: clientIp,
                                deviceType: deviceType,
                            }],
                            $position: 0
                        }
                    }
                };

                const updatedvalidityPeriodTo = await discountPlanModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update1, {
                    new: true
                });
                const updatedvalidityPeriodToLogs = await discountPlanLogModel.findOneAndUpdate({ discountPlanId: discountPlanId }, update2, {
                    new: true
                });
            }

            if (blackOutDates) {
                // Create an object to represent the entire request
                const requestData = {
                    body: req.body,
                    // headers: req.headers
                };
                const requestDataString = JSON.stringify(requestData)
                // Create an object to represent the entire response
                const responseData = {
                    message: "Discount rate plan created",
                    statuscode: res.statusCode,
                };
                const responseString = JSON.stringify(responseData)
                const blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());
                // console.log(blackOutDatesArray)
                const logId = Randomstring.generate(10)
                const newBlackoutObject = {
                    blackOutDates: blackOutDatesArray,
                    logId: logId
                };
                const newBlackOutDateLogObject = {
                    logId: logId,
                    request: requestDataString,
                    response: responseString
                }

                // Use unshift to add the new object at the beginning
                findDiscountPlan.blackOutDates.unshift(newBlackoutObject);
                findDiscountPlanLogs.blackOutDates.unshift(newBlackOutDateLogObject)
                await findDiscountPlan.save();
                await findDiscountPlanLogs.save();
            }

            if (applicableOn) {
                // Create an object to represent the entire request
                const requestData = {
                    body: req.body,
                    // headers: req.headers
                };
                const requestDataString = JSON.stringify(requestData)
                // Create an object to represent the entire response
                const responseData = {
                    message: "Discount rate plan created",
                    statuscode: res.statusCode,
                };
                const responseString = JSON.stringify(responseData)
                const blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());
                // console.log(blackOutDatesArray)
                const logId = Randomstring.generate(10)
                const newApplicableOnObject = {
                    applicableOn: applicableOn,
                    logId: logId
                };
                const newApplicableOnLogObject = {
                    logId: logId,
                    request: requestDataString,
                    response: responseString
                }

                // Use unshift to add the new object at the beginning
                findDiscountPlan.applicableOn.unshift(newApplicableOnObject);
                findDiscountPlanLogs.applicableOn.unshift(newApplicableOnLogObject)
                await findDiscountPlan.save();
                await findDiscountPlanLogs.save();
            }

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