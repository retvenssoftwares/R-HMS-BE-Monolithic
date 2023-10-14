// models/user.js
import mongoose from 'mongoose';

const verifiedUsersSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  firstName: {
    type: String,
    required: false
  },
  role: [{
    role: {
      type: String,
      required: false
    },
    modifiedDate: String
  }],
  lastName: {
    type: String,
    required: false,
  },
  designation: [
    {
      designation: {
        type: String,
        required: false
      },
      modifiedDate: String
    }],
  phoneNumber: [{
    phoneNumber: {
      type: String,
      required: false
    },
    modifiedDate: String
  }],
  username: [{
    username: { type: String, default: '' },
    modifiedDate: String
  }],
  hotelRcode: {
    type: String,
    required: false,
    default: ''
  },
  authCode: {
    type: String
  },
  email: {
    type: String
  },
  link: {
    type: String,
    default: ''
  },
  propertyTypeSOC: { type: String, default: '' }, //single or chain
 
  password: [{
    password: {
      type: String
    },
    modifiedDate: String
  }],

  verificationStatus: {
      type: String,
      default: 'false'
   },
},
  {
    versionKey: false
  });



const verifiedUser = mongoose.model('verifiedUser', verifiedUsersSchema);

export default verifiedUser;