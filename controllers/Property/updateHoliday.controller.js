import randomstring from 'randomstring'
import holiday from '../../models/holidays.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import holidayLog from '../../models/LogModels/holidayLog.js'

const patchHoliday = async (req, res) => {
    try {
        const { shortCode, holidayName, startDate, endDate,deviceType,ipAddress,displayStatus } = req.body;
        const { holidayId, userId } = req.query;
        const findUser = await verifiedUser.findOne({ userId });
        const userid = findUser.userId;
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

                //save data in logs

                const findHolidayLog = await holidayLog.findOne( {holidayId:holidayId} );

                if (findHolidayLog){
                if (shortCode) {
                    const shortCodeObject = {
                        shortCode:updatedHoliday.shortCode[0].shortCode,
                        logId:updatedHoliday.shortCode[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findHolidayLog.shortCode.unshift(shortCodeObject);
                }
                if (displayStatus) {
                    const displayStatusObject = {
                        displayStatus:updatedHoliday.displayStatus[0].displayStatus,
                        logId:updatedHoliday.displayStatus[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findHolidayLog.displayStatus.unshift(displayStatusObject);
                }

                if (holidayName) {
                    const holidayNameObject = {
                        holidayName:updatedHoliday.holidayName[0].holidayName,
                        logId:updatedHoliday.holidayName[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findHolidayLog.holidayName.unshift(holidayNameObject);
                }
    
                if (startDate) {
                    const startDateObject = {
                        startDate:updatedHoliday.startDate[0].startDate,
                        logId:updatedHoliday.startDate[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findHolidayLog.startDate.unshift(startDateObject);
                }
    
                if (endDate) {
                    const endDateObject = {
                        endDate:updatedHoliday.endDate[0].endDate,
                        logId:updatedHoliday.endDate[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findHolidayLog.endDate.unshift(endDateObject);
                }
    
            }
            await findHolidayLog.save();

                return res.status(200).json({ message: "Holiday updated successfully ", statuscode: 200 });
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
