const mongoose = require("mongoose");
const randomstrinng = require("randomstring");

const paymentmethod = new mongoose.Schema({
  creditDebitCard: {
    cardNumber: { type: String, default: "" },
    expirationDate: { type: String, default: "" },
    cvv: { type: String, default: "" },
    cardholderName: { type: String, default: "" },
    date: { type: String, default: "" },

    //required: [cardNumber, expirationDate, cvv, cardholderName, date],
  },

  cash: {
    cashTransId: { type: String, default: randomstrinng.generate(5) },
    name: { type: String, default: "" },
    mobile: { type: String, default: "" },
    date: { type: String, default: "" },
  },

  onlinePaymentPlatform: {
    onlinePlateFormName: { type: String, default: "" },
    date: { type: String, default: "" },
    onlineTranId: { type: String, default: "" },
    date : { type: String, default: ""}
  },

  mobilePaymentApp: {
    mobilePaymentTranId: { type: String, default: "" },
    mobilePaymentAppName: { type: String, default: "" },
    date : { type: String, default: ""}
  },

  bankTransfer: {
    accountNumber: { type: String, default: "" },
    routingNumber: { type: String, default: "" },
    swiftCode: { type: String, default: "" },
    iban: { type: String, default: "" },
    bankName: { type: String, default: "" },
    accountHolderName: { type: String, default: "" },
    bankAddress: { type: String, default: "" },
    bankCity: { type: String, default: "" },
    bankCountry: { type: String, default: "" },
    date : { type: String, default: ""}

    //required: ["accountNumber"],
  },

  electronicFundsTransfer: {
    bankName: { type: String, default: "" },
    accountHolderName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    date : { type: String, default: ""}

    //required: [bankName, accountHolderName, accountNumber],
  },

  check: {
    checkNumber: { type: String, default: "" },
    bankName: { type: String, default: "" },
    routingNumber: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    checkDate: { type: String, default: "" },
    checkAmount: { type: String, default: "" },
    issuedBy: { type: String, default: "" },
    remarks: { type: String, default: "" },
    date : { type: String, default: ""}
  },

  prepaidCard: {
    cardNumber: { type: "String", default: "" },
    cardType: { type: "String", default: "" },
    cardholderName: { type: "String", default: "" },
    expirationDate: { type: "String", default: "" },
    cvv: { type: "String", default: "" },
    issuer: { type: "String", default: "" },
    issuingBank: { type: "String", default: "" },
    activationDate: { type: "String", default: "" },
    balance: { type: "String", default: "" },
    date : { type: String, default: ""}
  },
  //required: ["cardNumber", "cardholderName", "expirationDate", "cvv"],
});

const paymentdata = new mongoose.model("paymenttype", paymentmethod);

module.export = paymentdata;
