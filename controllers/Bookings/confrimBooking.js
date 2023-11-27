import bookingModel from "../../models/reservationModel.js";
import axios from "axios";
import bookingDetails from "../../models/confirmBooking.js";
import guestModel from "../../models/guestDetails.js";
import holdData from "../../models/holdBooking.js";
import company from "../../models/company.js";
import randomString from "randomstring";
import verifiedUser from "../../models/verifiedUsers.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import comapnyLedger from "../../models/companyLedger.js";

export const addConfirmBooking = async (req, res) => {
  try {
    const { reservationNumber, userId } = req.body;
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

    const data = await holdData.find({ reservationNumber: reservationNumber });
    const companyId = await holdData.findOne({
      reservationNumber: reservationNumber,
    });



    const balanceDetails = await comapnyLedger.findOne({ companyId: companyId.companyId, propertyId: companyId.propertyId })


    if (Math.abs(balanceDetails.totalBalance[0].totalBalance) >= parseInt(balanceDetails.creditLimit[0].creditLimit)) {

      return res.status(200).json({ message: "You Dont have sufficient Balance" })

    }


    // Calculate updatedTotalBalance based on the changes made above
    const updatedTotalBalance = await comapnyLedger.findOneAndUpdate(
      {
        $and: [
          { companyId: companyId.companyId },
          { propertyId: companyId.propertyId },
        ],
      },
      {
        $inc: {
          [`totalBalance.${0}.totalBalance`]: -companyId.reservationRate[0].roomCharges[0].grandTotal,
        },
        $push: {
          ledger: {
            $each: [
              {
                particular: reservationNumber,
                dr: companyId.reservationRate[0].roomCharges[0].grandTotal,
                balance: '0', // Assuming balance should be a string
                date: new Date(),
              },
            ],
            $position: 0,
          },
        },
      },
      {
        new: true,
      }
    );

    // Get the updated value of totalBalance.${0}.totalBalance
    const updatedTotalBalanceValue = updatedTotalBalance.totalBalance[0].totalBalance;

    // Update the balance field in the ledger at position 0
    await comapnyLedger.updateOne(
      {
        $and: [
          { companyId: companyId.companyId },
          { propertyId: companyId.propertyId },
        ],
      },
      {
        $set: {
          'ledger.0.balance': String(updatedTotalBalanceValue),
        },
      }
    );




    if (!data) {
      return res
        .status(404)
        .json({ message: "data not found", statusCode: 404 });
    }

    var reservationIds = [];

    data.forEach(async (item) => {
      const {
        guestId,
        guestName,
        salutation,
        phoneNumber,
        emailAddress,
        addressLine1,
        addressLine2,
        country,
        state,
        city,
        pinCode,
        reservationId,
        propertyId,
        bookingId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        ratePlanName,
        nightCount,
        bookingTime,
        inventory,
        reservationNumber,
        extraAdultRate,
        extraChildRate,
        ratePlanId,
        adults,
        childs,
        charge,
        reservationRate,
        barRateReservation,
        roomTypeName,
        remark,
        internalNote,
        baseRates,
        c_form,
        companyId,
        extraInclusionId,
      } = item;

      reservationIds.push(reservationId);
      // Here, you can create a new object or perform any operation with the extracted fields and store it in another collection
      // For example, you can use a new model and save the extracted fields to another collection
      const newData = new bookingDetails({
        guestId,
        guestName: [
          {
            guestName: guestName[0].guestName || "",
            logId: randomString.generate(10),
          },
        ],

        salutation: [
          {
            salutation: salutation[0].salutation || "",
            logId: randomString.generate(10),
          },
        ],

        // guestProfile: [{
        //   guestProfile: guestProfile.guestProfile && guestProfile.guestProfile[0] && guestProfile.guestProfile[0].guestProfile || "",
        //   logId: randomString.generate(10)
        // }],

        phoneNumber: [
          {
            phoneNumber: phoneNumber[0].phoneNumber || "",
            logId: randomString.generate(10),
          },
        ],

        emailAddress: [
          {
            emailAddress: emailAddress[0].emailAddress || "",
            logId: randomString.generate(10),
          },
        ],

        addressLine1: [
          {
            addressLine1: addressLine1[0].addressLine1 || "",
            logId: randomString.generate(10),
          },
        ],

        addressLine2: [
          {
            addressLine2: addressLine2[0].addressLine2 || "",
            logId: randomString.generate(10),
          },
        ],

        country: [
          {
            country: country[0].country || "",
            logId: randomString.generate(10),
          },
        ],

        state: [
          {
            state: state[0].state || "",
            logId: randomString.generate(10),
          },
        ],

        city: [
          {
            city: city[0].city || "",
            logId: randomString.generate(10),
          },
        ],

        pinCode: [
          {
            pinCode: pinCode[0].pinCode || "",
            logId: randomString.generate(10),
          },
        ],

        checkInDate: [
          {
            checkInDate: checkInDate[0].checkInDate || "",
            logId: randomString.generate(10),
          },
        ],

        checkOutDate: [
          {
            checkOutDate: checkOutDate[0].checkOutDate || "",
            logId: randomString.generate(10),
          },
        ],

        reservationId,
        propertyId,
        bookingId,
        extraInclusionId,

        roomTypeId: [
          {
            roomTypeId: roomTypeId[0].roomTypeId || "",
            logId: randomString.generate(10),
          },
        ],

        bookingTime,
        inventory,
        companyId,

        ratePlanName: [
          {
            ratePlanName: ratePlanName[0].ratePlanName || "",
            logId: randomString.generate(10),
          },
        ],

        reservationRate: [{
          roomCharges: reservationRate[0].roomCharges[0] || "",
          logId: randomString.generate(10),
        }],

        nightCount: [
          {
            nightCount: nightCount[0].nightCount || "",
            logId: randomString.generate(10),
          },
        ],

        extraAdultRate: [
          {
            extraAdultRate: extraAdultRate[0].extraAdultRate || "",
            logId: randomString.generate(10),
          },
        ],

        extraChildRate: [
          {
            extraChildRate: extraChildRate[0].extraChildRate || "",
            logId: randomString.generate(10),
          },
        ],

        charge: [
          {
            charge: charge[0].charge || "",
            logId: randomString.generate(10),
          },
        ],

        adults: [
          {
            adults: adults[0].adults || "",
            logId: randomString.generate(10),
          },
        ],

        childs: [
          {
            childs: childs[0].childs || "",
            logId: randomString.generate(10),
          },
        ],

        // barRateReservation,roomTypeName,remark,internalNote,baseRates,c_from

        ratePlanId: [
          {
            ratePlanId: ratePlanId[0].ratePlanId || "",
            logId: randomString.generate(10),
          },
        ],

        barRateReservation: Array.isArray(barRateReservation) && barRateReservation.length > 0
          ? [
            {
              barRateReservation: barRateReservation[0]?.barRateReservation[0] || "",
              logId: randomString.generate(10),
            },
          ]
          : [],


        baseRates: Array.isArray(baseRates) && baseRates.length > 0
          ? [
            {
              baseRates: baseRates[0]?.baseRates || "",
              logId: randomString.generate(10),
            },
          ]
          : [],


        roomTypeName: [
          {
            roomTypeName: roomTypeName[0].roomTypeName || "",
            logId: randomString.generate(10),
          },
        ],

        remark: [
          {
            remark: remark[0].remark || "",
            logId: randomString.generate(10),
          },
        ],

        internalNote: [
          {
            internalNote: internalNote[0].internalNote || "",
            logId: randomString.generate(10),
          },
        ],


        c_form: [
          {
            c_form: c_form[0].c_form || "",
            logId: randomString.generate(10),
          },
        ],

        companyId: companyId || "",

        reservationNumber,
      });
      // Save the newData to the new collection
      await newData.save();
    });


     const deleteData = await holdData.deleteMany({ reservationNumber: reservationNumber })

    return res.status(200).json({
      message: "Booking created successfully",
      reservationNumber: reservationNumber,
      reservationIds,
    });
  } catch (error) {
    console.error("Error retrieving records:", error);
    // Send an error response to the client
    res.status(500).json({ error: "Internal Server Error" });
  }
};
