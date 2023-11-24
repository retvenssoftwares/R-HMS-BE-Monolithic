import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import confirmBooking from "../../models/confirmBooking.js";
import verifiedUser from "../../models/verifiedUsers.js";

export const getCompanyReservation = async (req, res) => {
    try {
        const { companyId , userId } = req.query;

        const findUser = await verifiedUser.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                message: "User not found or invalid userid",
                statuscode: 404,
            });
        }

        const authCodeValue = req.headers["authcode"];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success === false) {
            return res.status(400).json({
                message: "Invalid authentication token",
                statuscode: 400,
            });
        }

        const companyDetails = await confirmBooking.find({ companyId: companyId });

        if (!companyDetails || companyDetails.length === 0) {
            return res
                .status(404)
                .json({ message: "Company reservation not found", statuscode: 404 });
        }

        const reservationData = [];

        companyDetails.forEach((reservation) => {
            const data = {
                guestName:
                    reservation.guestName &&
                    reservation.guestName[0] &&
                    reservation.guestName[0].guestName || "",
                checkInDate:
                    reservation.checkInDate &&
                    reservation.checkInDate[0] &&
                    reservation.checkInDate[0].checkInDate || "",
                checkOutDate:
                    reservation.checkOutDate &&
                    reservation.checkOutDate[0] &&
                    reservation.checkOutDate[0].checkOutDate || "",
                nightCount:
                    reservation.nightCount &&
                    reservation.nightCount[0] &&
                    reservation.nightCount[0].nightCount || "",
                ratePlanName:
                    reservation.ratePlanName &&
                    reservation.ratePlanName[0] &&
                    reservation.ratePlanName[0].ratePlanName || "",

                employeeId : reservation.employeeId || "",
                roomNo : reservation.roomNo || ""
                
            };
            reservationData.push(data);
        });

        return res.status(200).json({ data: reservationData, statusCode: 200 });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};
