import transportation from "../../models/transportationTypes.js"
import verifying from "../../models/verifiedUsers.js"
import randomString from "randomstring"
import { convertTimestampToCustomFormat, getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js"
import transportationLog from "../../models/LogModels/transportationLog.js"
import property from "../../models/property.js"

//post 
export const transportationAdd = async (req, res) => {
    const { userId ,deviceType,transportationModeName,shortCode,ipAddress} = req.body;

    try {
        const UserauthCode = await verifying.findOne({ userId: userId });
        if (!UserauthCode) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }

        const authCodeDetails = req.headers["authcode"];
        const userRole = UserauthCode.role[0].role || ""
        const result = await findUserByUserIdAndToken(userId, authCodeDetails);
        const currentUTCTime= await getCurrentUTCTimestamp();

        if (result.success) {
            const data = transportation({
                transportationId: randomString.generate(8),
                shortCode: [{
                    shortCode: shortCode,
                    logId: randomString.generate(10)
                }],
                propertyId: req.body.propertyId,
                transportationModeName: [{
                    transportationModeName: transportationModeName,
                    logId: randomString.generate(10)
                }],
                createdBy: userRole,
                createdOn: await getCurrentUTCTimestamp(),
                displayStatus: [{ displayStatus: "1", logId: randomString.generate(10) }],
                createdOn: currentUTCTime,
                modifiedBy: [],
                modifiedOn: []
            });

           const savedTranportation=  await data.save();

            //save data in logs

            const addTransportationLog=new transportationLog({
                userId:savedTranportation.userId,
                propertyId:savedTranportation.propertyId,
                createdOn:savedTranportation.createdOn,
                createdBy:savedTranportation.createdBy,
                transportationId:savedTranportation.transportationId,
                shortCode: [
                    {
                      shortCode: savedTranportation.shortCode[0].shortCode,
                      logId: savedTranportation.shortCode[0].logId,
                      userId: userId,
                      deviceType: deviceType,
                      ipAddress:ipAddress,
                      modifiedOn: currentUTCTime,
                    },
                  ],
                  transportationModeName: [{
                    transportationModeName: savedTranportation.transportationModeName[0].transportationModeName,
                    logId: savedTranportation.transportationModeName[0].logId,
                    userId: userId,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn: currentUTCTime,
                }],
                displayStatus: [{
                    displayStatus: savedTranportation.displayStatus[0].displayStatus,
                    logId: savedTranportation.displayStatus[0].logId,
                    userId: userId,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn: currentUTCTime,
                }],
            })

            await addTransportationLog.save();
            return res.status(200).json({ message: "Transportation added successfully", statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

//update
export const updateTransportation = async (req, res) => {
    try {
        const { userId, transportationId } = req.query
       
        const { shortCode, transportationModeName,deviceType,ipAddress,displayStatus } = req.body
        const UserauthCode = await verifying.findOne({ userId: userId });
        const userid= UserauthCode.userId
        const userRole=UserauthCode.role[0].role
        if (!UserauthCode) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }
        const findTransportationRecord = await transportation.findOne({ transportationId })
        if (!findTransportationRecord) {
            return res.status(404).json({ message: "Transportation type not found", statuscode: 404 });
        }
        const authCodeDetails = req.headers["authcode"];

        const result = await findUserByUserIdAndToken(userId, authCodeDetails);
        const currentUTCTime= await getCurrentUTCTimestamp();

        if (result.success) {
            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomString.generate(10)
                };
                findTransportationRecord.shortCode.unshift(shortCodeObject);
            }
            if (transportationModeName) {
                const transportationModeNameObject = {
                    transportationModeName: transportationModeName,
                    logId: randomString.generate(10)
                };
                findTransportationRecord.transportationModeName.unshift(transportationModeNameObject);
            }

            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: randomString.generate(10)
                };
                findTransportationRecord.displayStatus.unshift(displayStatusObject);
            }
            const modifiedByObj = {
                modifiedBy: userRole,
                logId: randomString.generate(10)
            }
            
            const modifiedOnObj = {
                modifiedOn: await getCurrentUTCTimestamp(),
                logId: randomString.generate(10)
            }

            findTransportationRecord.modifiedBy.unshift(modifiedByObj)
            findTransportationRecord.modifiedOn.unshift(modifiedOnObj);

            const savedTranportation= await findTransportationRecord.save();

            //save data in logs

            const findTransportationLog = await transportationLog.findOne({transportationId });

                if (findTransportationLog){
                if (shortCode) {
                    const shortCodeObject = {
                        shortCode: savedTranportation.shortCode[0].shortCode,
                        logId: savedTranportation.shortCode[0].logId,
                        userId: userid,
                        deviceType: deviceType,
                        ipAddress:ipAddress,
                        modifiedOn: currentUTCTime,
                    };
                    findTransportationLog.shortCode.unshift(shortCodeObject);
                }
                if(transportationModeName){
                    const transportationModeNameObject={
                    transportationModeName: savedTranportation.transportationModeName[0].transportationModeName,
                    logId: savedTranportation.transportationModeName[0].logId,
                    userId: userid,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn: currentUTCTime,
                }
                findTransportationLog.transportationModeName.unshift(transportationModeNameObject);
                }
                if(displayStatus){
                    const displayStatusObject={
                    displayStatus: savedTranportation.displayStatus[0].displayStatus,
                    logId: savedTranportation.displayStatus[0].logId,
                    userId: userid,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn: currentUTCTime,
                }
                findTransportationLog.displayStatus.unshift(displayStatusObject);
                }
            }
            await findTransportationLog.save();

            return res.status(200).json({ message: "Transportation Updated successfully", statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

//get
export const getTransportation = async (req, res) => {
    try {
        const userId = req.query.userId;
        const propertyId=req.query.propertyId;
        const UserauthCode = await verifying.findOne({ userId: userId });
        const targetTimeZone = req.query.targetTimeZone;

        if (!UserauthCode) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }
        const findProperty = await property.findOne({ propertyId: propertyId })
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId", statuscode: 404 })
        }

        const authCodeDetails = req.headers["authcode"];

        const getDetails = await transportation.find({ propertyId:propertyId, "displayStatus.0.displayStatus": "1" }).sort({_id:-1}).lean();

        if (!getDetails) {
            return res.status(404).json({ message: "No transportation types found", statuscode: 404 });
        }

        const result = await findUserByUserIdAndToken(userId, authCodeDetails);

        if (result.success) {
            if (getDetails.length > 0) {
                const convertedTransportationTypes = getDetails.map(transportationType => {
                    const convertedDateUTC = convertTimestampToCustomFormat(transportationType.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (transportationType.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(transportationType.modifiedOn[0].modifiedOn, targetTimeZone);
                    }
                    const modifiedBy = transportationType.modifiedBy.length > 0 ? transportationType.modifiedBy[0].modifiedBy : "";

                    return {
                        ...transportationType._doc,
                        createdOn: convertedDateUTC,
                        createdBy: transportationType.createdBy,
                        propertyId: transportationType.propertyId,
                        transportationModeName: transportationType.transportationModeName[0].transportationModeName || '',
                        modifiedBy: modifiedBy,
                        transportationId: transportationType.transportationId || '',
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: transportationType.shortCode[0].shortCode || ''
                    };
                });

                return res.status(200).json({ data: convertedTransportationTypes, statuscode: 200 });
            }
            else {
                return res.status(200).json({ message: "No transportation types found",count:"0",  statuscode: 200 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}
