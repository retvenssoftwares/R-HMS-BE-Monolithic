import mongoose from "mongoose";
import db2 from "../../db/conn2.js";
const guestLogModel = new mongoose.Schema({
  guestId: {
    type: String,
    default: "",
  },

  salutation: [
    {
      salutation: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  guestProfile: [
    {
      guestProfile: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  guestName: [
    {
      guestName: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  phoneNumber: [
    {
      phoneNumber: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  emailAddress: [
    {
      emailAddress: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  addressLine1: [
    {
      addressLine1: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  addressLine2: [
    {
      addressLine2: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  country: [
    {
      country: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  state: [
    {
      state: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  city: [
    {
      city: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  pinCode: [
    {
      pinCode: {
        type: String,
        default: "",
      },

      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  otherInfo: [
    {
      identityProfile: {
        type: String,
        default: "",
      },
      idNumber: {
        type: String,
        default: "",
      },
      idType: {
        type: String,
        default: "",
      },
      issuingCountry: {
        type: String,
        default: "",
      },
      issuingCity: {
        type: String,
        default: "",
      },
      expiryDate: {
        type: String,
        default: "",
      },
      paymentMethodId: {
        type: String,
        default: "",
      },
      directBillingAccountId: {
        type: String,
        default: "",
      },
      birthDate: {
        type: String,
        default: "",
      },
      birthCountry: {
        type: String,
        default: "",
      },
      nationality: {
        type: String,
        default: "",
      },
      vipStatus: {
        type: String,
        default: "",
      },
      spouseBirthDate: {
        type: String,
        default: "",
      },
      weddingAnniversary: {
        type: String,
        default: "",
      },
      registrationNo: {
        type: String,
        default: "",
      },
      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],

  c_form: [
    {
      c_form: [
        {
          address: {
            type: String,
            default: "",
          },
          state: {
            type: String,
            default: "",
          },
          city: {
            type: String,
            default: "",
          },
          pinCode: {
            type: String,
            default: "",
          },
          arrivedFrom: {
            type: String,
            default: "",
          },
          dateOfArrival: {
            type: String,
            default: "",
          },
          passportNo: {
            type: String,
            default: "",
          },
          placeOfIssue: {
            type: String,
            default: "",
          },
          issueDate: {
            type: String,
            default: "",
          },
          expiryDate: {
            type: String,
            default: "",
          },
          visaNo: {
            type: String,
            default: "",
          },
          visaType: {
            type: String,
            default: "",
          },
          placeOfIssue: {
            type: String,
            default: "",
          },
          issueDate: {
            type: String,
            default: "",
          },
          expiryDate: {
            type: String,
            default: "",
          },
          whetherEmployedInIndia: {
            type: String,
            default: "",
          },
          guardianName: {
            type: String,
            default: "",
          },
          age: {
            type: String,
            default: "",
          },
          purposeOfVisit: {
            type: String,
            default: "",
          },
          nextDestinationPlace: {
            type: String,
            default: "",
          },
          nextDestinationState: {
            type: String,
            default: "",
          },
          nextDestinationcity: {
            type: String,
            default: "",
          },
          contactNo: {
            type: String,
            default: "",
          },
          parmanentResidentContactNo: {
            type: String,
            default: "",
          },
          mobileNo: {
            type: String,
            default: "",
          },
          parmanentResidentMobileNo: {
            type: String,
            default: "",
          },
          remark: {
            type: String,
            default: "",
          },
        },
      ],
      logId: {
        type: String,
        default: "",
      },
      modifiedOn: {
        type: String,
        default: "",
      },
      userId: {
        type: String,
        default: "",
      },
      ipAddress: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  ],
});

const guestLogs = db2.model("guestLogsModel", guestLogModel);
export default guestLogs;
