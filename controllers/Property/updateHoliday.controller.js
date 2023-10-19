import holiday from '../../models/holidays.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchHoliday = async (req, res) => {
    try {
        const { userId, shortCode, holidayName, startDate, endDate } = req.body;
        const holidayId = req.params.holidayId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const userToken = findUser.authCode;
        let userRole = findUser.role[0].role;

        if (authCodeValue !== userToken) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

        const findHoliday = await holiday.findOne({ holidayId });

        if (!findHoliday || !holidayId) {
            return res.status(404).json({ message: "holiday not found", statuscode: 404 });
        }

        if (shortCode) {
            findHoliday.shortCode = shortCode;
        }

        const currentUTCTime = await getCurrentUTCTimestamp();

        if (holidayName) {
            const holidayNameObject = {
                holidayName: holidayName
            };
            findHoliday.holidayName.unshift(holidayNameObject);
        }

        if (startDate) {
            const startDateObject = {
                startDate: startDate
            };
            findHoliday.startDate.unshift(startDateObject);
        }

        if (endDate) {
            const endDateObject = {
                endDate: endDate
            };
            findHoliday.endDate.unshift(endDateObject);
        }

        const modifiedByObject = {
            modifiedBy: userRole
        };

        findHoliday.modifiedBy.unshift(modifiedByObject);
        findHoliday.modifiedOn.unshift({ modifiedOn: currentUTCTime });

        const updatedHoliday = await findHoliday.save();

        if (updatedHoliday) {
            return res.status(200).json({ message: "holiday successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "holiday not found", statuscode: 404 });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchHoliday;
