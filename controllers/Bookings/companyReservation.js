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
import  companyRatePlan  from "../../models/companyRatePlane.js";
import ratePlan from "../../models/barRatePlan.js";

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
    discountReservation,
    roomCharges,
    applyDiscount,
    paymentDetails,
    barRateReservation,
    guestInfo,
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

  for (let i = 0; i < guestInfo.length; i++) {
    if (guestInfo[i].guestId) {
      guestIdArray.push({ guestId: guestInfo[i].guestId });
    } else {
      const guestDetails = new guestCollections({
        guestId: randomString.generate(10),

        salutation: [
          {
            salutation: guestInfo[i].salutation,
            logId: randomString.generate(10),
          },
        ],

        employeeId :[{
          employeeId: guestInfo[i].employeeId,
          logId: randomString.generate(10),
        }],

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


        c_form: [{
          c_form: guestInfo[i].c_form,
          logId: randomString.generate(10),
        }],

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


    rateTypeId: [
      {
        rateTypeId: rateTypeId,
        logId: randomString.generate(10),
      },
    ],
  

    companyId : companyId,



    roomDetails: [{
      roomDetails: roomDetails,
      remark: remark,
      createTask: createTask,
      logId: randomString.generate(10),
    }],



    reservationRate: [{
      roomCharges: roomCharges,
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

  console.log(dictionary)


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

      // Function to get guest details by guestId
      async function getGuestDetails(guestId) {
        return await guestCollections.findOne({ guestId });
      }

      console.log(result)


      // Function to create and save hold data
      async function createAndSaveHoldData(booking, guestId, c_form, inclusion, adult, childs, charge, extraAdult, extraChild, remark, internalNote, roomTypeId, index, ratePlanId, name, ratePlan, guestDetails) {

        const nightCount = booking.nightCount[0].nightCount || ""
       
        const company = booking.companyId || ""

        const created = booking.createdBy[0].createdBy || ""

        const reservationSummaryDetails = booking.reservationRate.map((item)=>({
          roomCharges : item.roomCharges[0].roomCharges || "",
          extras : item.roomCharges[0].extras || "",
          taxes : item.roomCharges[0].taxes || "",
          from : item.roomCharges[0].from || "",
          to : item.roomCharges[0].to || "",
          grandTotal : item.roomCharges[0].grandTotal || ""
        }))

        const payment = booking.paymentDetails.map((item)=>({
          billTo : item.billTo,
          paymentNote : item.paymentNote
        }))

        // const cardDeatils = booking.cardDeatils.map((item)=>({
        //   nameOnCard : item.cardDeatils[0].nameOnCard || "",
        //   cardNumber : item.cardDeatils[0].cardNumber || "",
        //   cvv : item.cvv[0].cvv || "",
        //   expiryDate : item.expiryDate[0].expiryDate || ""
        // }))
    
        const form = c_form.map((item) => ({
          c_form: item.c_form,
          logId: item.logId
        }))


        const hold = new holdData({
          bookingId: booking.bookingId || "",
          reservationId: booking.reservationIds && booking.reservationIds[index] || "",
          propertyId: booking.propertyId || "",
          companyId: company || "",

          roomTypeId: [{
            roomTypeId: roomTypeId || "",
            logId: randomString.generate(10)
          }],

          
          employeeId : [{
            employeeId : guestDetails.employeeId && guestDetails.employeeId[0] && guestDetails.employeeId[0].employeeId || "",
            logId: randomString.generate(10)
          }],

          ratePlanId: [{
            ratePlanId : ratePlan || "",
            logId : randomString.generate(10)
          }],

          rateTypeId: booking.rateTypeId && booking.rateTypeId[0] && booking.rateTypeId[0].rateTypeId || "",

          roomTypeName:[{
            roomTypeName : name || "",
            logId : randomString.generate(10)
          }],

      
          c_form: form,

          nightCount :[{
            nightCount : nightCount || "",
            logId : randomString.generate(10)
          }],
          extraInclusionId: inclusion || "",

          extraAdultRate:[{
            extraAdultRate : extraAdult || "",
            logId : randomString.generate(10)
          }],

          extraChildRate:[{
            extraChildRate : extraChild || "",
            logId : randomString.generate(10)
          }],

          adults:[{
            adults : adult || "",
            logId : randomString.generate(10)
          }],

          childs:[{
            childs : childs || "",
            logId : randomString.generate(10)
          }],

          charge:[{
            charge : charge || "",
            logId : randomString.generate(10)
          }],

          guestId: guestId || "",

          guestName: [{
            guestName: guestDetails.guestName && guestDetails.guestName[0] && guestDetails.guestName[0].guestName || "",
            logId: randomString.generate(10)
          }],

          salutation: [{
            salutation: guestDetails.salutation && guestDetails.salutation[0] && guestDetails.salutation[0].salutation || "",
            logId: randomString.generate(10)
          }],

          guestProfile: [{
            guestProfile: guestDetails.guestProfile && guestDetails.guestProfile[0] && guestDetails.guestProfile[0].guestProfile || "",
            logId: randomString.generate(10)
          }],

          phoneNumber: [{
            phoneNumber: guestDetails.phoneNumber && guestDetails.phoneNumber[0] && guestDetails.phoneNumber[0].phoneNumber || "",
            logId: randomString.generate(10)
          }],

          emailAddress: [{
            emailAddress: guestDetails.emailAddress && guestDetails.emailAddress[0] && guestDetails.emailAddress[0].emailAddress || "",
            logId: randomString.generate(10)
          }],

          addressLine1 : [{
            addressLine1 : guestDetails.addressLine1 && guestDetails.addressLine1[0] && guestDetails.addressLine1[0].addressLine1 || "",
            logId: randomString.generate(10)
          }],

          addressLine2 : [{
            addressLine2 : guestDetails.addressLine2 && guestDetails.addressLine2[0] && guestDetails.addressLine2[0].addressLine2 || "",
            logId: randomString.generate(10)
          }],

          country : [{
            country : guestDetails.country && guestDetails.country[0] && guestDetails.country[0].country || "",
            logId: randomString.generate(10)
          }],

          state : [{
            state : guestDetails.state && guestDetails.state[0] && guestDetails.state[0].state || "",
            logId: randomString.generate(10)
          }],

          city : [{
            city : guestDetails.city && guestDetails.city[0] && guestDetails.city[0].city || "",
            logId: randomString.generate(10)
          }],

          pinCode : [{
            pinCode : guestDetails.pinCode && guestDetails.pinCode[0] && guestDetails.pinCode[0].pinCode || "",
            logId: randomString.generate(10)
          }],  

          checkInDate: [{
            checkInDate: booking.checkInDate && booking.checkInDate[0] && booking.checkInDate[0].checkInDate || "",
            logId: randomString.generate(10)
          }],
          

          checkOutDate: [{
            checkOutDate: booking.checkOutDate && booking.checkOutDate[0] && booking.checkOutDate[0].checkOutDate || "",
            logId: randomString.generate(10)
          }],


          bookingTime: await getCurrentUTCTimestamp(),
          //checkInDate: booking.checkInDate && booking.checkInDate[0] && booking.checkInDate[0].checkInDate || "",
          reservationNumber: booking.reservationNumber || "",
          //checkOutDate: booking.checkOutDate && booking.checkOutDate[0] && booking.checkOutDate[0].checkOutDate || "",
          remark:[{
            remark : remark || "",
            logId: randomString.generate(10)
          }],

          internalNote:[{
            internalNote : internalNote || "",
            logId: randomString.generate(10)
          }],

          inventory: 1,
          
          ratePlanName:[{
            ratePlanName : ratePlan || '',
            logId: randomString.generate(10)
          }],

          createdBy : [{
            createdBy : created,
            logId : randomString.generate(10)
          }],

          reservationRate : [{
            roomCharges : reservationSummaryDetails,
            logId : randomString.generate(10)
          }],

          applyDiscount :[{
            applyDiscount : booking.applyDiscount[0].applyDiscount || "",
            logId : randomString.generate(10)
          }],

          paymentDetails : [{
            paymentDetails : payment,
            logId : randomString.generate(10)
          }],

          // cardDetails : [{
          //   cardDetails : cardDeatils,
          //   logId : randomString.generate(10)
          // }]
        
        });

        console.log(hold)

        await hold.save();

      }

      // Your optimized loop
      await Promise.all(roomDetailArray.map(async (roomDetail, index) => {
        const roomTypeId = roomDetail.roomTypeId;
        const ratePlanId = roomDetail.ratePlanId
        const remark = roomDetail.remark[0].specialRemark;
        const internalNote = roomDetail.remark[0].internalNote

        const ratePlanName = await companyRatePlan.findOne({companyRatePlanId : ratePlanId})
        // console.log(ratePlanName)

        const ratePlan = ratePlanName.ratePlanName[0].ratePlanName || ""
        // check Rate plan for that room

        const guestId = booking.guestId.length === 1 ? booking.guestId[0].guestId : booking.guestId[index].guestId;


        // filds require in the room Details 
        const inclusion = roomDetail.extraInclusionId || ""
        const adult = roomDetail.adults || ""
        const childs = roomDetail.childs || ""
        const charge = roomDetail.charge || ""
        const extraAdult = roomDetail.extraAdult || ""
        const extraChild = roomDetail.extraChild || ""


        

        console.log(result[roomTypeId])
        // check room requriments  
        if (dictionary[roomTypeId] && dictionary[roomTypeId] <= result[roomTypeId]) {
          const guestDetails = await getGuestDetails(guestId);
          const c_form = guestDetails.c_form
          const roomTypeName = await roomType.findOne({ roomTypeId: roomTypeId })
          const name = roomTypeName.roomTypeName[0].roomTypeName || ""
          // console.log(name)

          return createAndSaveHoldData(booking, guestId, c_form, inclusion, adult, childs, charge, extraAdult, extraChild, remark, internalNote, roomTypeId, index, ratePlanId, name, ratePlan,guestDetails);
        }else{
          console.log("gfhvjbknlm")
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
