import randomstring from 'randomstring'
import holiday from '../../models/holidays.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'

const patchHoliday = async (req, res) => {
    try {
        const { shortCode, holidayName, startDate, endDate, displayStatus } = req.body;
        const { holidayId, userId } = req.query;
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            let userRole = findUser.role[0].role;


            const findHoliday = await holiday.findOne({ holidayId });

            if (!findHoliday || !holidayId) {
                return res.status(404).json({ message: "Holiday not found", statuscode: 404 });
            }

            if (shortCode) {
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomstring.generate(10)
                };
                findHoliday.shortCode.unshift(shortCodeObject);
            }

            const currentUTCTime = await getCurrentUTCTimestamp();

            if (holidayName) {
                const holidayNameObject = {
                    holidayName: holidayName,
                    logId: randomstring.generate(10)
                };
                findHoliday.holidayName.unshift(holidayNameObject);
            }

            if (startDate) {
                const startDateObject = {
                    startDate: startDate,
                    logId: randomstring.generate(10)
                };
                findHoliday.startDate.unshift(startDateObject);
            }

            if (endDate) {
                const endDateObject = {
                    endDate: endDate,
                    logId: randomstring.generate(10)
                };
                findHoliday.endDate.unshift(endDateObject);
            }

            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: randomstring.generate(10)
                };
                findHoliday.displayStatus.unshift(displayStatusObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: randomstring.generate(10)
            };

            findHoliday.modifiedBy.unshift(modifiedByObject);
            findHoliday.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: randomstring.generate(10) });

            const updatedHoliday = await findHoliday.save();

            if (updatedHoliday) {
                return res.status(200).json({ message: "Holiday successfully updated", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchHoliday;
