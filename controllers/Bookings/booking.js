import bookingsModel from "../../models/bookings.js";
import randomString from "randomstring";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";

export const createResrvation = async (req, res) => {
  const {
    userId,
    propertyId,
    checkIn,
    checkOut,
    nightCount,
    rateType,
    companyReservation,
    bookingType,
    roomDetails,
    remark,
    discountReservation,
    reservationSummary,
    applyDiscount,
    paymentDetails,
  } = req.body;

  const bookingId = randomString.generate(10);

  const findUser = await verifiedUser.findOne({ userId: userId });
  if (!findUser) {
    return res
      .status(404)
      .json({ message: "User not found or invalid userid", statuscode: 404 });
  }
  const userToken = findUser.authCode;
  console.log(userToken);
  const authCodeValue = req.headers["authcode"];

  if (authCodeValue !== userToken) {
    return res
      .status(400)
      .json({ message: "Invalid authentication token", statuscode: 400 });
  }

  let userRole = findUser.role[0].role;

  const createBooking = new bookingsModel({
    bookingId: bookingId,
    propertyId: propertyId,
    checkIn: [
      {
        checkIn: checkIn,
        logId: randomString.generate(10),
      },
    ],
    checkOut: [
      {
        checkOut: checkOut,
        logId: randomString.generate(10),
      },
    ],
    nightCount: [
      {
        nightCount: nightCount,
        logId: randomString.generate(10),
      },
    ],
    createdBy: [
      {
        createdBy: userRole,
        logId: randomString.generate(10),
      },
    ],
    createdOn: [
      {
        createdOn: await getCurrentUTCTimestamp(),
        logId: randomString.generate(10),
      },
    ],
    rateType: [
      {
        rateType: rateType,
        logId: randomString.generate(10),
      },
    ],
    companyReservation: [
      {
        companyReservation: companyReservation,
        logId: randomString.generate(10),
      },
    ],

    discountReservation: discountReservation.map((item) => ({
      bookingType: item.bookingType.map((booking) => ({
        bookingType: booking.bookingType,
        logId: randomString.generate(10),
      })),
      discountPlan: item.discountPlan.map((plan) => ({
        discountPlan: plan.discountPlan,
        logId: randomString.generate(10),
      })),
      discountType: item.discountType.map((type) => ({
        discountType: type.discountType,
        logId: randomString.generate(10),
      })),
      discountAmount: item.discountAmount.map((amount) => ({
        discountAmount: amount.discountAmount,
        logId: randomString.generate(10),
      })),
    })),

    roomDetails: roomDetails.map((item) => ({
      roomType: item.roomType.map((type) => ({
        roomType: type.roomType,
        logId: randomString.generate(10),
      })),
      ratePlan: item.ratePlan.map((plan) => ({
        ratePlan: plan.ratePlan,
        logId: randomString.generate(10),
      })),
      adults: item.adults.map((adult) => ({
        adults: adult.adults,
        logId: randomString.generate(10),
      })),
      childs: item.childs.map((child) => ({
        childs: child.childs,
        logId: randomString.generate(10),
      })),
      charge: item.charge.map((charge) => ({
        charge: charge.charge,
        logId: randomString.generate(10),
      })),
      extraAdult: item.extraAdult.map((extra) => ({
        extraAdult: extra.extraAdult,
        logId: randomString.generate(10),
      })),
      extraInclusion: item.extraInclusion.map((inclusion) => ({
        extraInclusion: inclusion.extraInclusion,
        logId: randomString.generate(10),
      })),
    })),

    remark: remark.map((item) => ({
      specialRemark: item.specialRemark.map((remark) => ({
        specialRemark: remark.specialRemark,
        logId: randomString.generate(10),
      })),

      internalNote: item.internalNote.map((note) => ({
        internalNote: note.internalNote,
        logId: randomString.generate(10),
      })),
    })),

    reservationSummary: reservationSummary.map((item) => ({
      roomCharges: item.roomCharges.map((charge) => ({
        roomCharges: charge.roomCharges,
        logId: randomString.generate(10),
      })),
      extras: item.extras.map((extra) => ({
        extras: extra.extras,
        logId: randomString.generate(10),
      })),
      taxes: item.taxes.map((tax) => ({
        taxes: tax.taxes,
        logId: randomString.generate(10),
      })),
      from: item.from.map((from) => ({
        from: from.from,
        logId: randomString.generate(10),
      })),
      to: item.to.map((to) => ({
        to: to.to,
        logId: randomString.generate(10),
      })),
      grandTotal: item.grandTotal.map((total) => ({
        grandTotal: total.grandTotal,
        logId: randomString.generate(10),
      })),
    })),

    applyDiscount: [
      {
        applyDiscount: applyDiscount,
        logId: randomString.generate(10),
      },
    ],


    paymentDetails: paymentDetails.map((item) => ({
      billTo: item.billTo.map((b) => ({
        billTo: b.billTo,
        logId: randomString.generate(10),
      })),

      paymentNote: item.paymentNote.map((note) => ({
        paymentNote: note.paymentNote,
        logId: randomString.generate(10),
      })),
    })),

  });

  await createBooking.save();

  return res
    .status(200)
    .json({ message: "booking created successfully", statusCode: 200 });
};
