import bookingsModel from "../../models/reservationModel.js";
import randomString from "randomstring";
import guestCollections from "../../models/guestDetails.js";


export const testingReservation = async (req, res) => { // Assuming roomDetails is part of the request body
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
    // console.log("Request Body:", roomDetails);
    const numberOfRooms = roomDetails.length;
    // console.log("Number of Rooms:", numberOfRooms);
    const bookingId = randomString.generate(10);

    const startDateObj = new Date(checkInDate);
    const checkInDateISO = startDateObj.toISOString();
    const endDateObj = new Date(checkOutDate);
    const checkOutDateISO = endDateObj.toISOString();

    for (let i = 0; i < numberOfRooms; i++) {
        console.log("Room Details:", roomDetails[i]);
    
        const newData = new bookingsModel({
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
        });

        const booking = await newData.save()
    
        // Add a new item at the beginning of roomTypeId array
        booking.roomDetails[0].roomTypeId.unshift({
            roomTypeId: 'newRoomTypeId', // Replace with actual value
            logId:  randomString.generate(10), // Replace with actual value
        });
    
        // Add a new item at the beginning of ratePlan array
        newData.roomDetails[0].ratePlan.unshift({
            ratePlan: 'newRatePlan', // Replace with actual value
        });
    
        // Save the new data to the database
        await newData.save();
    }
    
};


