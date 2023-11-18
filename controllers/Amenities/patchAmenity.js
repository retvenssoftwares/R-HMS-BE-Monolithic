import amenity from '../../models/amenity.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import randomString from "randomstring"

const patchAmenity = async (req, res) => {

    try {
        const { userId,amenityId} = req.query
        const { shortCode, amenityName, amenityType, amenityIcon, amenityIconLink, displayStatus } = req.body;

        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const findUser = await verifiedUser.findOne({ userId })

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