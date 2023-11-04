import bookingsModel from "../../models/bookings.js";
import randomString from "randomstring";
import guestCollections from "../../models/guestDetails.js"
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";

export const createResrvation = async (req, res) => {
  const {
    userId,
    guestId,
    propertyId,
    checkIn,
    checkOut,
    nightCount,
    rateTypeId,
    companyId,
    roomDetails,
    remark,
    discountReservation,
    reservationSummary,
    applyDiscount,
    paymentDetails,
  } = req.body;

  let guestIdArray = [];

  const bookingId = randomString.generate(10);

  const findUser = await verifiedUser.findOne({ userId: userId });
  if (!findUser) {
    return res
      .status(404)
      .json({ message: "User not found or invalid userid", statuscode: 404 });
  }
  const userToken = findUser.authCode;

  const authCodeValue = req.headers["authcode"];

  if (authCodeValue !== userToken) {
    return res
      .status(400)
      .json({ message: "Invalid authentication token", statuscode: 400 });
  }

  // Validate the date format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(checkIn) || !dateFormatRegex.test(checkOut)) {
      return res.status(400).json({ message: "Please enter the date in the correct format (yyyy-mm-dd)", statuscode: 400 });
  }

const startDateObj = new Date(checkIn)
const checkInDateISO = startDateObj.toISOString()
const endDateObj = new Date(checkOut)
const checkOutDateISO = endDateObj.toISOString()

  let userRole = findUser.role[0].role;

  for (let i = 0; i < guestId.length; i++) {
    if(guestId[i]){
      guestIdArray.push({ guestId: guestId[i]});
      const createBooking = new bookingsModel({
        guestId: guestIdArray,
        bookingId: bookingId,
        propertyId: propertyId,
        checkIn: [
          {
            checkIn: checkInDateISO,
            logId: randomString.generate(10),
          },
        ],
        checkOut: [
          {
            checkOut: checkOutDateISO,
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
            rateTypeId: rateTypeId,
            logId: randomString.generate(10),
          },
        ],
        companyReservation: [
          {
            companyId: companyId,
            logId: randomString.generate(10),
          },
        ],
    
        discountReservation: discountReservation.map((item) => ({
          bookingType: item.bookingType.map((booking) => ({
            bookingTypeId: booking.bookingTypeId,
            logId: randomString.generate(10),
          })),
          discountPlan: item.discountPlan.map((plan) => ({
            discountPlanId: plan.discountPlanId,
            logId: randomString.generate(10),
          })),
          discountType: item.discountType.map((type) => ({
            discountTypeId: type.discountTypeId,
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
            ratePlanId: plan.ratePlanId,
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
            extraInclusionId: inclusion.extraInclusionId,
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
  
    }else{
      const {salutation , guestName, phoneNumber, emailAddress, addressLine1, addressLine2, country, state, city, pinCode} = req.body
      const guestDetails = new guestCollections({
        
        guestId : randomString.generate(10),
  
        salutation :[{
          salutation :salutation,
          logId : randomString.generate(10)
        }],
  
        guestName : [{
          guestName : guestName,
          logId : randomString.generate(10)
        }], 
  
        phoneNumber :[{
          phoneNumber :phoneNumber,
          logId :  randomString.generate(10)
        }],
  
        emailAddress :[{
          emailAddress : emailAddress,
          logId  : randomString.generate(10)
        }],
  
        addressLine1 :[{
          addressLine1 :addressLine1,
          logId  : randomString.generate(10)
        }],
  
        addressLine2 :[{
          addressLine2 :addressLine2,
          logId  : randomString.generate(10)
        }],
  
        country :[{
          country : country,
          logId : randomString.generate(10)
        }], 
  
        state :[{
          state : state,
          logId : randomString.generate(10)
        }],
  
        city :[{
          city : city,
          logId : randomString.generate(10)
        }],
  
        pinCode :[{
          pinCode  : pinCode,
          logId : randomString.generate(10)
        }]
      })
  
      const guest = await guestDetails.save()
       
      // booking details
      guestIdArray.push({ guestId: guest.guestId });
      const createBooking = new bookingsModel({
        guestId: guestIdArray,
        bookingId: bookingId,
        propertyId: propertyId,
        checkIn: [
          {
            checkIn: checkInDateISO,
            logId: randomString.generate(10),
          },
        ],
        checkOut: [
          {
            checkOut: checkOutDateISO,
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
            rateTypeId: rateTypeId,
            logId: randomString.generate(10),
          },
        ],
        companyReservation: [
          {
            companyId: companyId,
            logId: randomString.generate(10),
          },
        ],
    
        discountReservation: discountReservation.map((item) => ({
          bookingType: item.bookingType.map((booking) => ({
            bookingTypeId: booking.bookingTypeId,
            logId: randomString.generate(10),
          })),
          discountPlan: item.discountPlan.map((plan) => ({
            discountPlanId: plan.discountPlanId,
            logId: randomString.generate(10),
          })),
          discountType: item.discountType.map((type) => ({
            discountTypeId: type.discountTypeId,
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
            ratePlanId: plan.ratePlanId,
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
            extraInclusionId: inclusion.extraInclusionId,
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
  
  
    }

  }

 

  return res
    .status(200)
    .json({ message: "booking created successfully", statusCode: 200 });
};
