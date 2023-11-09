import bookingsModel from "../../models/reservationModel.js";
import randomString from "randomstring";
import guestCollections from "../../models/guestDetails.js";
import {
  generateFourDigitRandomNumber,
  getCurrentLocalTimestamp,
  getCurrentUTCTimestamp,
} from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";
import holdData from "../../models/holdBooking.js";
import axios from "axios";


export const creatQuickReservation = async (req, res) => {
  const {
    userId,
    propertyId,
    checkIn,
    checkOut,
    nightCount,
    rateTypeId,
    companyId,
    roomDetails,
    bookingTypeId,
    guestInfo,
    quickRemark,
    quickInternalnote,
    isQuickReseration,
    isGroupBooking

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
    return res
      .status(400)
      .json({
        message: "Please enter the date in the correct format (yyyy-mm-dd)",
        statuscode: 400,
      });
  }

  const startDateObj = new Date(checkIn);
  const checkInDateISO = startDateObj.toISOString();
  const endDateObj = new Date(checkOut);
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

      // booking details
      guestIdArray.push({ guestId: guest.guestId });
    }
  }

  // create reservation
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

    
    isQuickReseration : isQuickReseration,
        
    isGroupBooking : isGroupBooking,
    


    barRateReservation : [{
        bookingTypeId : bookingTypeId,
        logId: randomString.generate(10),
      }],
  

    roomDetails: roomDetails.map((item) => ({
      roomTypeId: item.roomTypeId.map((type) => ({
        roomTypeId: type.roomTypeId,
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

      //quick purpose
      rate : item.rate.map((r)=>({
        rate : r.rate,
        logId: randomString.generate(10),
      }))
    })),



     //quickRemark
     quickRemark:[{
      quickRemark : quickRemark,
      logId: randomString.generate(10),
    }],

    //quickInternalnote
    quickInternalnote :[{
      quickInternalnote :quickInternalnote,
      logId: randomString.generate(10),
    }],

    reservationNumber: await generateFourDigitRandomNumber(),
  });

  const details = await createBooking.save();

  console.log(details);

  const data = details.roomDetails;

  //add reservation ids
  for (let i = 0; i < data.length; i++) {
    const add = details.reservationNumber;
    var rsv = add + "-" + (i + 1);
    details.reservationIds.push(rsv);
    await details.save();
  }

  // hold inventory


  

  const headersData = req.body.headersData;

  const apiUrl = `https://api.hotelratna.com/api/getRoomAvailability?userId=${req.body.userId}&propertyId=${req.body.propertyId}&checkInDate=${checkIn}&checkOutDate=${checkOut}`;

  const config = {
    headers: {
      authcode: headersData,
    },
  };

  
  const booking = await bookingsModel.findOne({ bookingId: details.bookingId });
  // console.log(booking)
  const roomDetail = booking.roomDetails;


  const dictionary = {};
  for (const item of roomDetail) {
    const roomTypeId = item.roomTypeId[0].roomTypeId;
    if (!dictionary[roomTypeId]) {
      dictionary[roomTypeId] = 1;
    } else {
      dictionary[roomTypeId] += 1;
    }
  }

  axios .get(apiUrl, { headers: config.headers })
   .then(async (response) => {
    if (response && response.data) {
      const array = response.data.data;
      const result = {};
      for (const item of array) {
        let minInventory = Infinity;
        for (let i = 0; i < item.calculatedInventoryData.length; i++) {
          if (item.calculatedInventoryData[i].inventory < minInventory) {
            minInventory = item.calculatedInventoryData[i].inventory;
          }
        }
        result[item.roomTypeId] = minInventory;
      }

      for (let i = 0; i < roomDetail.length; i++) {
        console.log(dictionary[roomDetail[i].roomTypeId[0].roomTypeId] , result[roomDetail[i].roomTypeId[0].roomTypeId])
        if (result[roomDetail[i].roomTypeId[0].roomTypeId] === 0) {
          return res.status(500).json({ message: "No Room Left for Reservation", statusCode: 500 });
        } else if (
          dictionary[roomDetail[i].roomTypeId[0].roomTypeId] &&
          dictionary[roomDetail[i].roomTypeId[0].roomTypeId] <= result[roomDetail[i].roomTypeId[0].roomTypeId]
        ) {
          if (booking.guestId.length === 1) {
            // console.log([roomDetail[i].roomTypeId[0].roomTypeId])
            const guestDetails = await guestCollections.findOne({guestId : booking.guestId[0].guestId})
            //console.log("nmnm",guestDetails.guestName[0].guestName)
            const hold = new holdData({
              bookingId: booking.bookingId || "",
                reservationId: booking.reservationIds && booking.reservationIds[i] || "",
                propertyId: booking.propertyId || "",
                roomTypeId: roomDetail[i].roomTypeId && roomDetail[i].roomTypeId[0] && roomDetail[i].roomTypeId[0].roomTypeId || "",
                guestId: booking.guestId && booking.guestId[0] && booking.guestId[0].guestId || "",
                guestName: guestDetails.guestName && guestDetails.guestName[0] && guestDetails.guestName[0].guestName || "",
                salutation: guestDetails.salutation && guestDetails.salutation[0] && guestDetails.salutation[0].salutation || "",
                phoneNumber: guestDetails.phoneNumber && guestDetails.phoneNumber[0] && guestDetails.phoneNumber[0].phoneNumber || "",
                emailAddress: guestDetails.emailAddress && guestDetails.emailAddress[0] && guestDetails.emailAddress[0].emailAddress || "",
                bookingTime: await getCurrentUTCTimestamp(),
                checkInDate: booking.checkIn && booking.checkIn[0] && booking.checkIn[0].checkIn || "",
                reservationNumber: booking.reservationNumber || "",
                checkOutDate: booking.checkOut && booking.checkOut[0] && booking.checkOut[0].checkOut || "",
                inventory: dictionary[roomDetail[i].roomTypeId && roomDetail[i].roomTypeId[0] && roomDetail[i].roomTypeId[0].roomTypeId] ? dictionary[roomDetail[i].roomTypeId[0].roomTypeId].toString() : ""
                ,
            });

            await hold.save();
          } else {
         

            const hold = new holdData({
              bookingId: booking.bookingId || "",
              reservationId: booking.reservationIds && booking.reservationIds[i] || "",
              propertyId: booking.propertyId || "",
              roomTypeId: roomDetail[i].roomTypeId && roomDetail[i].roomTypeId[0] && roomDetail[i].roomTypeId[0].roomTypeId || "",
              guestId: booking.guestId && booking.guestId[i] && booking.guestId[i].guestId || "",
              guestName: booking.guestName && booking.guestName[0] && booking.guestName[0].guestName || "",
              salutation: booking.salutation && booking.salutation[0] && booking.salutation[0].salutation || "",
              phoneNumber: booking.phoneNumber && booking.phoneNumber[0] && booking.phoneNumber[0].phoneNumber || "",
              emailAddress: booking.emailAdddress && booking.emailAdddress[0] && booking.emailAdddress[0].emailAdddress || "",
              bookingTime: await getCurrentUTCTimestamp(),
              checkInDate: booking.checkIn && booking.checkIn[0] && booking.checkIn[0].checkIn || "",
              reservationNumber: booking.reservationNumber || "",
              checkOutDate: booking.checkOut && booking.checkOut[0] && booking.checkOut[0].checkOut || "",
              inventory: dictionary[roomDetail[i].roomTypeId && roomDetail[i].roomTypeId[0] && roomDetail[i].roomTypeId[0].roomTypeId] ? dictionary[roomDetail[i].roomTypeId[0].roomTypeId].toString() : ""
              
            });

            await hold.save();
            
          }
        }
      }

      return res.status(200).json({ message: "booking created successfully", statusCode: 200 });
    } else {
      console.error("No data found in the response");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });


  return res
    .status(200)
    .json({ message: "booking created successfully", statusCode: 200 });
};
