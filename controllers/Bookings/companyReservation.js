import bookingsModel from "../../models/reservationModel.js";
import randomString from "randomstring";
import guestCollections from "../../models/guestDetails.js";
import {
  findUserByUserIdAndToken,
  generateFourDigitRandomNumber,



  getCurrentLocalTimestamp,
  getCurrentUTCTimestamp,
} from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";
import holdData from "../../models/holdBooking.js";
import roomType from "../../models/roomType.js"
// import guestModel from "../../models/guestDetails.js"
import nodeCorn from "node-cron"
import checkRoomAvailability from "../../controllers/InventoryAndRates/checkRoomAvailability.js"
import checkRate from "../InventoryAndRates/checkAvailableRates.js";

export const createCompanyResrvation = async (req, res) => {
  const {
    userId,
    propertyId,
    checkInDate,
    checkOutDate,
    nightCount,
    rateTypeId,
    companyId,
    roomDetails,
    remark,
    reservationSummary,
    applyDiscount,
    paymentDetails,
    isQuickReseration,
    isGroupBooking,
    cardDetails,
    createTask,
  } = req.body



  let guestIdArray = [];

  const bookingId = randomString.generate(10);

  const findUser = await verifiedUser.findOne({ userId: userId });

  if (!findUser) {
    return res
      .status(404)
      .json({ message: "User not found or invalid userid", statuscode: 404 });
  }
  const authCodeValue = req.headers["authcode"];

  const result = await findUserByUserIdAndToken(userId, authCodeValue);

  if (result.success === false) {
    return res
      .status(400)
      .json({ message: "Invalid authentication token", statuscode: 400 });
  }



  // Validate the date format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(checkInDate) || !dateFormatRegex.test(checkOutDate)) {
    return res
      .status(400)
      .json({
        message: "Please enter the date in the correct format (yyyy-mm-dd)",
        statuscode: 400,
      });
  }

  const startDateObj = new Date(checkInDate);
  const checkInDateISO = startDateObj.toISOString();
  const endDateObj = new Date(checkOutDate);
  const checkOutDateISO = endDateObj.toISOString();

  let userRole = findUser.role[0].role;

  // create reservation
  const createBooking = new bookingsModel({
    
    bookingId: bookingId,
    propertyId: propertyId,
    checkInDate: [
      {
        checkInDate: checkInDateISO,
        logId: randomString.generate(10),
      },
    ],
    checkOutDate: [
      {
        checkOutDate: checkOutDateISO,
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

    isQuickReseration: isQuickReseration,

    isGroupBooking: isGroupBooking,


    rateType: [
      {
        rateTypeId: rateTypeId,
        logId: randomString.generate(10),
      },
    ],


    companyId: companyId,

    roomDetails: [{
      roomDetails: roomDetails,
      remark: remark,
      createTask: createTask,
      logId: randomString.generate(10),
    }],



    reservationSummary: [{
      reservationSummary: reservationSummary,
      logId: randomString.generate(10),
    }],


    applyDiscount: [
      {
        applyDiscount: applyDiscount,
        logId: randomString.generate(10),
      },
    ],

    paymentDetails: [{
      paymentDetails: paymentDetails,
      logId: randomString.generate(10),
    }],


    reservationNumber: randomString.generate({ charset: 'numeric', length: 4 }),


    cardDetails: [{
      cardDetails: cardDetails,
      logId: randomString.generate(10)
    }],


  });

  const details = await createBooking.save();


  const data = details.roomDetails[0].roomDetails;

  //add reservation ids
  for (let i = 0; i < data.length; i++) {
    const add = details.reservationNumber;
    var rsv = add + "-" + (i + 1);
    details.reservationIds.push(rsv);
    await details.save();
  }

  const booking = await bookingsModel.findOne({ bookingId: details.bookingId });
  const roomDetailArray = booking.roomDetails[0].roomDetails;


  const dictionary = {};

  for (const roomDetail of roomDetailArray) {
    const roomTypeId = roomDetail.roomTypeId;
    if (!dictionary[roomTypeId]) {
      dictionary[roomTypeId] = 1;
    } else {
      dictionary[roomTypeId] += 1;
    }
  }


  try {
    const availableRooms = await checkRoomAvailability({
      query: {
        userId,
        propertyId,
        checkInDate,
        checkOutDate,
        status: true
      },
      headers: {
        authcode: authCodeValue
      }

    }, res);


    if (availableRooms) {
      const result = {};
      for (const room of availableRooms) {
        // console.log(dictionary[room.roomTypeId],room.minimumInventory)
        if (dictionary[room.roomTypeId] > room.minimumInventory) {
          return res.status(200).json({ message: "No Room Left for Reservation", statusCode: 200 });
        }

        result[room.roomTypeId] = room.minimumInventory;
      }



      // Function to create and save hold data
      async function createAndSaveHoldData(booking, inclusion, adult, childs, charge, extraAdult, extraChild, remark, internalNote, roomTypeId, index, ratePlanId, name) {

        const company = booking.companyId
        
        const hold = new holdData({
          bookingId: booking.bookingId || "",
          companyId :  company || "",
          reservationId: booking.reservationIds && booking.reservationIds[index] || "",
          propertyId: booking.propertyId || "",
          roomTypeId: roomTypeId || "",
          ratePlanId: ratePlanId || "",
          rateTypeId: booking.rateTypeId || "",
          roomTypeName: name || "",
          extraInclusionId: inclusion,
          extraAdultRate: extraAdult,
          extraChildRate: extraChild,
          adults: adult,
          childs: childs,                                                                                                                                                                                                                                                      
          charge: charge,
          bookingTime: await getCurrentUTCTimestamp(),
          checkInDate: booking.checkInDate && booking.checkInDate[0] && booking.checkInDate[0].checkInDate || "",
          reservationNumber: booking.reservationNumber || "",
          checkOutDate: booking.checkOutDate && booking.checkOutDate[0] && booking.checkOutDate[0].checkOutDate || "",
          remark: remark || "",
          internalNote: internalNote || "",
          inventory: 1,
       
        });

        await hold.save();

      }

      // Your optimized loop
      await Promise.all(roomDetailArray.map(async (roomDetail, index) => {
        const roomTypeId = roomDetail.roomTypeId;
        const ratePlanId = roomDetail.ratePlanId
        const remark = roomDetail.remark[0].specialRemark;
        const internalNote = roomDetail.remark[0].internalNote
        

        // filds require in the room Details 
        const inclusion = roomDetail.extraInclusionId || ""
        const adult = roomDetail.adults || ""
        const childs = roomDetail.childs || ""
        const charge = roomDetail.charge || ""
        const extraAdult = roomDetail.extraAdult || ""
        const extraChild = roomDetail.extraChild || ""

        

        // check room requriments  
        if (dictionary[roomTypeId] && dictionary[roomTypeId] <= result[roomTypeId]) {
          // const guestDetails = await getGuestDetails(guestId);
          // const c_form = guestDetails.c_form
          const roomTypeName = await roomType.findOne({ roomTypeId: roomTypeId })
          const name = roomTypeName.roomTypeName[0].roomTypeName || ""

          return createAndSaveHoldData(booking, inclusion, adult, childs, charge, extraAdult, extraChild, remark, internalNote, roomTypeId, index, ratePlanId, name);
        }
      }));


    } else {
      return res.status(404).json({ message: "somthing wrong", statusCode: 404 })
    }

    return res
      .status(200)
      .json({ message: "booking created successfully", statusCode: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

};
