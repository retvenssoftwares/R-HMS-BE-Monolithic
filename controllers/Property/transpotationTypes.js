import transportation from "../../models/transportationTypes.js"
import verifying from "../../models/verifiedUsers.js"
import randomString from "randomstring"
import { convertTimestampToCustomFormat, getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js"

//post 
export const transportationAdd = async (req, res) => {
    const { userId } = req.body;

    try {
        const UserauthCode = await verifying.findOne({ userId: userId });
        if (!UserauthCode) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }

        const authCodeDetails = req.headers["authcode"];
        const userRole = UserauthCode.role[0].role || ""
        const result = await findUserByUserIdAndToken(userId, authCodeDetails);

        if (result.success) {
            const data = transportation({
                transportationId: randomString.generate(8),
                shortCode: [{
                    shortCode: req.body.shortCode,
                    logId: randomString.generate(10)
                }],
                propertyId: req.body.propertyId,
                transportationModeName: [{
                    transportationModeName: req.body.transportationModeName,
                    logId: randomString.generate(10)
                }],
                createdBy: userRole,
                createdOn: await getCurrentUTCTimestamp(),
                modifiedBy: [],
                modifiedOn: []
            });

            await data.save();
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
        const { shortCode, transportationModeName } = req.body
        const UserauthCode = await verifying.findOne({ userId: userId });
        if (!UserauthCode) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }
        const userRole = UserauthCode.role[0].role || ""
        const findTransportationRecord = await transportation.findOne({ transportationId })
        if (!findTransportationRecord) {
            return res.status(404).json({ message: "Transportation type not found", statuscode: 404 });
        }
        const authCodeDetails = req.headers["authcode"];

        const result = await findUserByUserIdAndToken(userId, authCodeDetails);

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

            await findTransportationRecord.save();
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
        const UserauthCode = await verifying.findOne({ userId: userId });
        const targetTimeZone = req.query.targetTimeZone;

        if (!UserauthCode) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
        }

        const authCodeDetails = req.headers["authcode"];

        const getDetails = await transportation.find({ propertyId: req.query.propertyId }).lean();

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
                        createdBy:paymentType.createdBy,
                        propertyId: transportationType.propertyId,
                        transportationModeName: transportationType.transportationModeName[0].transportationModeName ||{},
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: transportationType.shortCode[0].shortCode || {}
                    };
                });

                return res.status(200).json({ data: convertedTransportationTypes, statuscode: 200 });
            }
            else {
                return res.status(404).json({ error: "No transportation types found", statuscode: 404 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}
