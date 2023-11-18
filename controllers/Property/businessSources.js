import { convertTimestampToCustomFormat, getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import businessSourcesModel from "../../models/businessSources.js";
import verifying from "../../models/verifiedUsers.js"
import randomString from "randomstring"
import businessSourcesLog from "../../models/LogModels/businessSourcesLog.js";
//post
export const addBusinessSources = async (req, res) => {
    try {
        const {userId,deviceType,ipAddress} = req.body
        const findUser = await verifying.findOne({ userId: userId })

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }

        const userRole = findUser.role[0].role
        const authCodeDetails = req.headers["authcode"]
        const result = await findUserByUserIdAndToken(userId, authCodeDetails)
        const currentUTCTime= await getCurrentUTCTimestamp()

        if (result.success) {
            const data = businessSourcesModel({
                sourceId: randomString.generate(8),
                shortCode: [{
                    shortCode: req.body.shortCode,
                    logId: randomString.generate(10)
                }],
                propertyId: req.body.propertyId,
                sourceName: [{
                    sourceName: req.body.sourceName,
                    logId: randomString.generate(10)
                }],
                displayStatus: [{ displayStatus: "1", logId: randomString.generate(10) }],
                createdBy: userRole,
                createdOn: currentUTCTime,
                modifiedOn: [],
                modifiedBy: []
            })

            const savedBussinessSources= await data.save()

            //save data in log 

            const addBusinessSourceslog=new businessSourcesLog({
                userId:savedBussinessSources.userId,
                sourceId:savedBussinessSources.sourceId,
                createdBy:savedBussinessSources.createdBy,
                createdOn:savedBussinessSources.createdOn,
                propertyId:savedBussinessSources.propertyId,
                shortCode: [
                    {
                      logId: savedBussinessSources.shortCode[0].logId,
                      shortCode: savedBussinessSources.shortCode[0].shortCode,
                      userId: userId,
                      deviceType: deviceType,
                      ipAddress:ipAddress,
                      modifiedOn:currentUTCTime,
                    },
                  ],
                  sourceName: [
                    {
                      logId: savedBussinessSources.sourceName[0].logId,
                      sourceName: savedBussinessSources.sourceName[0].sourceName,
                      userId: userId,
                      deviceType: deviceType,
                      ipAddress:ipAddress,
                      modifiedOn:currentUTCTime,
                    },
                  ],
            })
            await addBusinessSourceslog.save()

            return res.status(200).json({ message: "Business source added successfully", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

//update
export const updateBusinessSources = async (req, res) => {
    try {
        const { userId, sourceId } = req.query
        const findUser = await verifying.findOne({ userId: userId })
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }

        if (!sourceId) {
            return res.status(400).json({ message: "Please enter valid sourceId", statuscode: 400 })
        }
        const userRole = findUser.role[0].role
        const authCodeDetails = req.headers["authcode"]
        const result = await findUserByUserIdAndToken(userId, authCodeDetails)
        const { shortCode, sourceName, displayStatus } = req.body
        if (result.success) {
            if (shortCode) {
                const logId1 = randomString.generate(10)
                const update1 = {
                    $push: {
                        shortCode: {
                            $each: [{
                                shortCode: shortCode,
                                logId: logId1
                            }],
                            $position: 0
                        }
                    }
                };
                const updatedShortCode = await businessSourcesModel.findOneAndUpdate({ sourceId: sourceId }, update1, {
                    new: true
                });

            }

            if (sourceName) {
                const logId1 = randomString.generate(10)
                const update1 = {
                    $push: {
                        sourceName: {
                            $each: [{
                                sourceName: sourceName,
                                logId: logId1
                            }],
                            $position: 0
                        }
                    }
                };
                const updatedSourceName = await businessSourcesModel.findOneAndUpdate({ sourceId: sourceId }, update1, {
                    new: true
                });

            }
            if (displayStatus) {
                const logId1 = randomString.generate(10)
                const update1 = {
                    $push: {
                        displayStatus: {
                            $each: [{
                                displayStatus: displayStatus,
                                logId: logId1
                            }],
                            $position: 0
                        }
                    }
                };
                const updatedDisplayStatus = await businessSourcesModel.findOneAndUpdate({ sourceId: sourceId }, update1, {
                    new: true
                });

            }
            

           
            const logId2 = randomString.generate(10)
            const logId3 = randomString.generate(10)
            const update1 = {
                $push: {
                    modifiedBy: {
                        $each: [{
                            modifiedBy: userRole,
                            logId: logId2
                        }],
                        $position: 0
                    },
                    modifiedOn: {
                        $each: [{
                            modifiedOn: await getCurrentUTCTimestamp(),
                            logId: logId3
                        }],
                        $position: 0
                    }
                }
            };
            const updatedBusinessSource = await businessSourcesModel.findOneAndUpdate({ sourceId: sourceId }, update1, {
                new: true
            });
            return res.status(200).json({ message: "Business source updated successfully", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

//get
export const getBusinessSources = async (req, res) => {
    try {
        const { userId, propertyId, targetTimeZone } = req.query
        const findUser = await verifying.findOne({ userId: userId })
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }
        if (!propertyId) {
            return res.status(400).json({ message: "Please enter valid propertyId", statuscode: 400 })
        }

        const businessSourcesFetch = await businessSourcesModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1" }).lean();

        const authCodeDetails = req.headers["authcode"]
        const result = await findUserByUserIdAndToken(userId, authCodeDetails)

        if (result.success) {
            if (businessSourcesFetch.length > 0) {
                const convertedBusinessSources = businessSourcesFetch.map(businessSource => {
                    const convertedDateUTC = convertTimestampToCustomFormat(businessSource.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (businessSource.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(businessSource.modifiedOn[0].modifiedOn, targetTimeZone);
                    }
                    const modifiedBy = businessSource.modifiedBy.length > 0 ? businessSource.modifiedBy[0].modifiedBy : "";

                    return {
                        ...businessSource._doc,
                        createdOn: convertedDateUTC,
                        sourceId: businessSource.sourceId || '',
                        createdBy: businessSource.createdBy,
                        sourceName: businessSource.sourceName[0].sourceName || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: businessSource.shortCode[0].shortCode || '',
                    };
                });

                return res.status(200).json({ data: convertedBusinessSources, statuscode: 200 });
            }
            else {
                return res.status(404).json({ error: "No business sources found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}