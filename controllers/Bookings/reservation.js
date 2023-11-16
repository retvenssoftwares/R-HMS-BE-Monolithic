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
import axios from "axios";
// import guestModel from "../../models/guestDetails.js"
import nodeCorn from "node-cron"
import getInventory from "../InventoryAndRates/getInventory.js";

export const createResrvation = async (req, res) => {
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
    discountReservation,
    reservationSummary,
    applyDiscount,
    paymentDetails,
    barRateReservation,
    guestInfo,
    isQuickReseration,
    isGroupBooking,
    cardDetails,
    createTask
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

  for (let i = 0; i < guestInfo.length; i++) {
    if (guestInfo[i].guestId !== "") {
      guestIdArray.push({ guestId: guestInfo[i].guestId });
    } else if (guestInfo[i].guestId === "") {
      const guestDetails = new guestCollections({
        guestId: randomString.generate(10),

        salutation: [
          {
            salutation: guestInfo[i].salutation,
            logId: randomString.generate(10),
          },
        ],

        guestName: [
          {
            guestName: guestInfo[i].guestName,
            logId: randomString.generate(10),
          },
        ],

        phoneNumber: [
          {
            phoneNumber: guestInfo[i].phoneNumber,
            logId: randomString.generate(10),
          },
        ],

        emailAddress: [
          {
            emailAddress: guestInfo[i].emailAddress,
            logId: randomString.generate(10),
          },
        ],

        addressLine1: [
          {
            addressLine1: guestInfo[i].addressLine1,
            logId: randomString.generate(10),
          },
        ],

        addressLine2: [
          {
            addressLine2: guestInfo[i].addressLine2,
            logId: randomString.generate(10),
          },
        ],

        country: [
          {
            country: guestInfo[i].country,
            logId: randomString.generate(10),
          },
        ],

        state: [
          {
            state: guestInfo[i].state,
            logId: randomString.generate(10),
          },
        ],

        city: [
          {
            city: guestInfo[i].city,
            logId: randomString.generate(10),
          },
        ],

        pinCode: [
          {
            pinCode: guestInfo[i].pinCode,
            logId: randomString.generate(10),
          },
        ],


      });

      const guest = await guestDetails.save();
    //  console.log(guest)

      // booking details
      guestIdArray.push({ guestId: guest.guestId });
    }
  }

  // create reservation
  const createBooking = new bookingsModel({
    guestId: guestIdArray,
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
    companyReservation: [
      {
        companyId: companyId,
        logId: randomString.generate(10),
      },
    ],

    barRateReservation : [{
      barRateReservation : barRateReservation,
      logId: randomString.generate(10),
    }],


    discountReservation : [{
      discountReservation : discountReservation,
      logId: randomString.generate(10),
    }],
    

    roomDetails:[{
      roomDetails:roomDetails,
      logId: randomString.generate(10),
    }],

    
 
    reservationSummary:[{
      reservationSummary:reservationSummary,
      logId: randomString.generate(10),
    }],
    

    applyDiscount: [
      {
        applyDiscount: applyDiscount,
        logId: randomString.generate(10),
      },
    ],

   paymentDetails : [{
    paymentDetails : paymentDetails,
    logId: randomString.generate(10),
   }],

   remark : [{
    remark:remark,
    logId: randomString.generate(10),
   }],  
    

    reservationNumber: await generateFourDigitRandomNumber(),


    cardDetails : [{
      cardDetails : cardDetails,
      logId : randomString.generate(10)
    }],

   createTask:[{
    createTask:createTask,
    logId: randomString.generate(10),
   }],
    

  });

  const details = await createBooking.save();

  //console.log(details);

  const data = details.roomDetails[0].roomDetails;

  //add reservation ids
  for (let i = 0; i < data.length; i++) {
    const add = details.reservationNumber;
    var rsv = add + "-" + (i + 1);
    details.reservationIds.push(rsv);
    await details.save();
  }

  // hold inventory

  const apiUrl = `https://api.hotelratna.com/api/getInventory?userId=${userId}&propertyId=${propertyId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;

  const booking = await bookingsModel.findOne({ bookingId: details.bookingId });
  // console.log(booking)
  const roomDetailArray = booking.roomDetails[0].roomDetails;
  //console.log(roomDetailArray)

  const dictionary = {};

  for (const roomDetail of roomDetailArray) { 
    //console.log(roomDetail)
    const roomTypeId = roomDetail.roomTypeId;
    // console.log(roomTypeId)
    if (!dictionary[roomTypeId]) {
        dictionary[roomTypeId] = 1;
    } else {
        dictionary[roomTypeId] += 1;
    }
}

  //console.log(dictionary)

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        authcode: req.headers["authcode"]
      }
    });

    if (response && response.data) {
      const array = response.data.data;
    
      // console.log(array);
      //  console.log(new Date().getSeconds())
      const result = {};

      array.forEach((item) => {
        const minInventory = Math.min(...item.calculatedInventoryData.map(data => data.inventory));
        result[item.roomTypeId] = minInventory;
      });


      // Function to get guest details by guestId
      async function getGuestDetails(guestId) {
        return await guestCollections.findOne({ guestId });
      }

      // Function to create and save hold data
      async function createAndSaveHoldData(booking, roomTypeId, index, guestDetails) {
        const hold = new holdData({
          bookingId: booking.bookingId || "",
          reservationId: booking.reservationIds && booking.reservationIds[index] || "",
          propertyId: booking.propertyId || "",
          roomTypeId: roomTypeId || "",
          guestId: booking.guestId && booking.guestId[index] && booking.guestId[index].guestId || "",
          guestName: guestDetails.guestName && guestDetails.guestName[0] && guestDetails.guestName[0].guestName || "",
          salutation: guestDetails.salutation && guestDetails.salutation[0] && guestDetails.salutation[0].salutation || "",
          phoneNumber: guestDetails.phoneNumber && guestDetails.phoneNumber[0] && guestDetails.phoneNumber[0].phoneNumber || "",
          emailAddress: guestDetails.emailAddress && guestDetails.emailAddress[0] && guestDetails.emailAddress[0].emailAddress || "",
          bookingTime: await getCurrentUTCTimestamp(),
          checkInDate: booking.checkInDate && booking.checkInDate[0] && booking.checkInDate[0].checkInDate || "",
          reservationNumber: booking.reservationNumber || "",
          checkOutDate: booking.checkOutDate && booking.checkOutDate[0] && booking.checkOutDate[0].checkOutDate || "",
          inventory: dictionary[roomTypeId] ? dictionary[roomTypeId].toString() : ""
        });

        await hold.save();
      }

      // Your optimized loop
      for (let i = 0; i < roomDetailArray.length; i++) {
        const roomTypeId = roomDetailArray[i].roomTypeId;
        const guestId = booking.guestId.length === 1 ? booking.guestId[0].guestId : booking.guestId[i].guestId;

        if (result[roomTypeId] === 0) {
          return res.status(200).json({ message: "No Room Left for Reservation", statusCode: 200 });
        }

        if (
          dictionary[roomTypeId] &&
          dictionary[roomTypeId] <= result[roomTypeId]
        ) {
          const guestDetails = await getGuestDetails(guestId);
          await createAndSaveHoldData(booking, roomTypeId, i, guestDetails);
        }
      }

    } else {
      console.error("No data found in the response");
    }

    return res
      .status(200)
      .json({ message: "booking created successfully", statusCode: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

};
