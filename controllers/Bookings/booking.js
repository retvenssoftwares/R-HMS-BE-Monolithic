import bookingsModel from "../../models/bookings.js"
import randomString from "randomstring"
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'
import verifiedUser from "../../models/verifiedUsers.js";
export const createResrvation = async(req,res)=>{
    const {userId , propertyId, checkIn, checkOut, nightCount, createdOn, rateType, companyReservation, bookingType, discountReservation, roomDetails, remark, reservationSummary, applyDiscount, paymentDetails} = req.body

    const bookingId  = randomString.generate(10)

    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser) {
        return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
    }
    const userToken = findUser.authCode;
    // let userRole = findUser.role[0].role;
    const authCodeValue = req.headers["authcode"]

    if (authCodeValue !== userToken) {
        return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
    }

  let userRole = findUser.role[0].role;

    const createBooking = new bookingsModel({
        bookingId : bookingId,

        propertyId : propertyId,

        checkIn : [{
            checkIn : checkIn,
            logId : randomString.generate(10),
        }],

        checkOut :[{
            checkOut : checkOut,
            logId : randomString.generate(10),
        }],

        nightCount : [{
            nightCount : nightCount,
            logId : randomString.generate(10),
        }],

        createdBy :[{
            createdBy :userRole,
            logId : randomString.generate(10),
        }],

        createdOn :[{
            createdOn : await getCurrentUTCTimestamp(),
            logId : randomString.generate(10),
        }],

        rateType :[{
            rateType : rateType,
            logId : randomString.generate(10),
        }],

        companyReservation : [{
            companyReservation : companyReservation,
            logId : randomString.generate(10),
        }],

        barRateReservation :[{
            bookingType : bookingType,
            logId : randomString.generate(10),
        }],

        discountReservation :[{
            discountReservation : discountReservation,
            logId : randomString.generate(10),
        }],

        roomDetails :[{
            roomDetails : roomDetails,
            logId : randomString.generate(10),
        }],

        remark : [{
            remark : remark,
            logId : randomString.generate(10),
        }],

        reservationSummary :[{
            reservationSummary : reservationSummary,
            logId : randomString.generate(10),
        }],

        applyDiscount :[{
            applyDiscount : applyDiscount,
            logId : randomString.generate(10),
        }],

        paymentDetails :[{
            paymentDetails : paymentDetails,
            logId : randomString.generate(10),
        }],


    })



    await createBooking.save()

    return res.status(200).json({message : "booking created successfully", statusCode : 200})
}