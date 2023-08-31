const mongoose = require(mongoose);
const randomestring = require(randomstring);

const reservationSchema = new mongoose.Schema({
  guestId: { type: String, default: "", required: false },

  reservationId :{type : String , default : randomestring.generate(15)},
  //groupId: { type: String, default: "", required: false },

  reservationStatus: { type: String, default: "", required: false },

  folioId: { type: String, default: "", required: false },

  ADR: { type: String, default: "", required: false },

  balance: { type: String, default: "", required: false },

  folioNo: { type: String, default: "", required: false },

  guestCountry: { type: String, default: "", required: false },

  guestEmail: { type: String, default: "", required: false },

  guestMobileNo: { type: String, default: "", required: false },

  guestsTranID: { type: String, default: "", required: false },

  language: { type: String, default: "", required: false },

  paid: { type: String, default: "", required: false },

  rentalDate: { type: String, default: "", required: false }, // means when guest occupy the room which they booked by own

  StopRoomMoveFlag: { type: String, default: "", required: false }, //  When this flag is enabled or set to "1," it indicates that the guest's room assignment should not be changed or moved for the duration of their reservation.

  tax: { type: String, default: "", required: false },

  voucherNo: { type: String, default: "", default : randomestring.generate(20) },

  adult: { type: String, default: "", required: false },

  //   allowSelfGuestportalaccess: { type: String, default: "", required: false },

  arrivaldatetime: { type: String, default: "", required: false },

  //   billto: { type: String, default: "", required: false },
  bookingTotal: { type: Number, default: "", required: false },

  bookingType: { type: String, default: "", required: false },

  businessSourceName: { type: String, default: "", required: false },

  businessSourceId: { type: String, default: "", required: false },

  //   channelHotelunkid: { type: String, default: "", required: false },
  //   channelunkid: { type: String, default: "", required: false },
  //   chargeName: { type: String, default: "", required: false },
  //   checkouttemplate: { type: String, default: "", required: false },
  child: { type: String, default: "", required: false },

  childAge: { type: String, default: "", required: false },

  //   commision: { type: String, default: "", required: false },

  //   commissionplanunkid: { type: String, default: "", required: false },
  //   companyunkid: { type: String, default: "", required: false },

  contactEmail: { type: String, default: "", required: false },
  //   contactunkid: { type: String, default: "", required: false },
  departureDateTime: { type: String, default: "", required: false },

  discount: { type: String, default: "", required: false },

  displayInclusionSeparatelyOnFolio: {
    type: String,
    default: "",
    required: false,
  },

  //   googleshortlink: { type: String, default: "", required: false },
  //   grcardno: { type: String, default: "", required: false },
  //   groupid: { type: String, default: "", required: false },
  GuestName: { type: String, default: "", required: false },
  GuestId: { type: String, default: "", required: false },
  //   icontooltip: { type: String, default: "", required: false },
  //   imgicon: { type: String, default: "", required: false },
  //   isSplitFlag: { type: String, default: "", required: false },
  //   isgroupowner: { type: String, default: "", required: false },

  //   marketcodeunkid: { type: String, default: "", required: false },
  //   masterfoliounkid: { type: String, default: "", required: false },
  mealPlanId: { type: String, default: "", required: false },

  rateTypeId: { type: String, default: "", required: false },
  //   referencelist: { type: String, default: "", required: false },
  regNo: { type: String, default: "", required: false },

  //   releasedatetime: { type: String, default: "", required: false },
  //   releaseterm: { type: String, default: "", required: false },

  reservationGauranteeId: { type: String, default: "", required: false }, // A reservation guarantee is a commitment made by a guest to ensure that their reserved room or accommodation will be held for them, even if they arrive later than the originally specified check-in time. This guarantee is often provided through various methods, such as providing credit card information or making a deposit.

  reservationNo: { type: String, default: "", required: false },

  voucherNo : { type: String, default: "", required: false },

  roomTypeId: { type: String, default: "", required: false },

  roomId: { type: String, default: "", required: false },

  source: { type: String, default: "", required: false },

  //   statusunkid: { type: String, default: "", required: false },

  //   subreservationno: { type: String, default: "", required: false },

  supress_roomcharge: { type: String, default: "", required: false }, //When this feature is enabled or set, specific charges related to the room or accommodation might not be shown on the guest's final bill or folio. This could include charges that are considered standard or included in the room rate, such as basic amenities or services. By suppressing these charges, the hotel can present a clearer and more concise bill to the guest, avoiding any confusion or unnecessary details.

  total: { type: String, default: "", required: false },

  tranDate: { type: String, default: "", required: false },

  transactionFlag: { type: String, default: "", required: false },

  tranId: { type: String, default: "", required: false },

  travelAgentId: { type: String, default: "", required: false },

  createdAt: { type: String, default: "", required: false },

  addedBy : {type: String, default :""},

  modifiedBy : {type: String, default :""},

  modifiedDate : {type: String, default :""},

  addedDate : {type: String, default :""},

  //   webinventoryunkid: { type: String, default: "", required: false },

  //   webrateunkid: { type: String, default: "", required: false },
});

const bookingDetails = new mongoose.model("booking", reservationSchema);
module.export = bookingDetails;
