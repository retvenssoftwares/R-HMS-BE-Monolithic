import amenity from '../../models/amenity.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import randomString from "randomstring"
import amenitiesLog from '../../models/LogModels/aminitiesLogs.js'

const patchAmenity = async (req, res) => {

    try {
        const { userId,amenityId} = req.query
        const { shortCode, amenityName, amenityType, amenityIcon, amenityIconLink, displayStatus,deviceType,ipAddress } = req.body;

        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const findUser = await verifiedUser.findOne({ userId })
        const userid=findUser.userId;
        if (result.success) {
            let userRole = findUser.role[0].role;

            const findAmenity = await amenity.findOne({ amenityId });

            if (!findAmenity || !amenityId) {
                return res.status(404).json({ message: "Amenity not found", statuscode: 404 });
            }

       
            const currentUTCTime = await getCurrentUTCTimestamp();

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode
                };
                findAmenity.shortCode.unshift(shortCodeObject);
            }

            if (amenityName) {
                const amenityNameObject = {
                    amenityName: amenityName
                };
                findAmenity.amenityName.unshift(amenityNameObject);
            }

            if (amenityType) {
                const amenityTypeObject = {
                    amenityType: amenityType
                };
                findAmenity.amenityType.unshift(amenityTypeObject);
            }
            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: randomString.generate(10)
                };
                findAmenity.displayStatus.unshift(displayStatusObject);
            }

            var amenityIconObject;
            if (amenityIcon) {
                if (amenityIcon === 'No') {
                    amenityIconObject = {
                        amenityIcon: amenityIcon
                    };
                    const amenityIconLinkObject = {
                        amenityIconLink: ""
                    };
                    findAmenity.amenityIcon.unshift(amenityIconObject);
                    findAmenity.amenityIconLink.unshift(amenityIconLinkObject);
                } else {
                    amenityIconObject = {
                        amenityIcon: amenityIcon
                    };
                    findAmenity.amenityIcon.unshift(amenityIconObject);
                }
            }

            if (amenityIconLink) {
                const amenityIconLinkObject = {
                    amenityIconLink: amenityIconLink
                };
                findAmenity.amenityIconLink.unshift(amenityIconLinkObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole
            };

            findAmenity.modifiedBy.unshift(modifiedByObject);
            findAmenity.modifiedOn.unshift({ modifiedOn: currentUTCTime });

            const updatedAmenity = await findAmenity.save();


            

            if (updatedAmenity) {

                //save data in logs

                const findAmenityLogs = await amenitiesLog.findOne({amenityId})
                if (findAmenityLogs){
                    if (shortCode) {
                        const shortCodeObject = {
                            shortCode: updatedAmenity.shortCode[0].shortCode,
                            logId: updatedAmenity.shortCode[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findAmenityLogs.shortCode.unshift(shortCodeObject);
                    }
                    if (amenityName) {
                        const amenityNameObject = {
                            amenityName: updatedAmenity.amenityName[0].amenityName,
                            logId: updatedAmenity.amenityName[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findAmenityLogs.amenityName.unshift(amenityNameObject);
                    }
                    if (amenityType) {
                        const amenityTypeObject = {
                            amenityType: updatedAmenity.amenityType[0].amenityType,
                            logId: updatedAmenity.amenityType[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findAmenityLogs.amenityType.unshift(amenityTypeObject);
                    }
                    if (displayStatus) {
                        const displayStatusObject = {
                            displayStatus: updatedAmenity.displayStatus[0].displayStatus,
                            logId: updatedAmenity.displayStatus[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findAmenityLogs.displayStatus.unshift(displayStatusObject);
                    }
                    if (amenityIconLink) {
                        const amenityIconLinkObject = {
                            amenityIconLink: updatedAmenity.amenityIconLink[0].amenityIconLink,
                            logId: updatedAmenity.amenityIconLink[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findAmenityLogs.amenityIconLink.unshift(amenityIconLinkObject);
                    }
                    if (amenityIcon) {
                        const amenityIconObject = {
                            amenityIcon: updatedAmenity.amenityIcon[0].amenityIcon,
                            logId: updatedAmenity.amenityIcon[0].logId,
                            userId: userid,
                            deviceType: deviceType,
                            ipAddress:ipAddress,
                            modifiedOn: currentUTCTime,
                        };
                        findAmenityLogs.amenityIcon.unshift(amenityIconObject);
                    }
                }
                await findAmenityLogs.save();

                return res.status(200).json({ message: "Amenity successfully updated", statuscode: 200 });

            } else {
                return res.status(404).json({ message: "Amenity not found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchAmenity;