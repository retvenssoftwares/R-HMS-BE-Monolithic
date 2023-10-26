// models/user.js
import mongoose from 'mongoose';
import db1 from '../db/conn.js'

const verifiedUsersSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: '',
  },
  firstName: {
    type: String,
    required: false,
    default: ''

  },
  role: [{
    role: {
      type: String,
      required: false,
      default: ''
    },
    modifiedDate: String
  }],
  lastName: {
    type: String,
    required: false,
    default: ''
  },
  designation: [
    {
      designation: {
        type: String,
        required: false,
        default: ''
      },
      modifiedDate: String
    }],
  phoneNumber: [{
    phoneNumber: {
      type: String,
      required: false,
      default: ''
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
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },

  token:[{
    token : {
      type: String,
      default : ''
    },

    deviceType:{
      type: String,
      default : ''
    }

  }],
  propertyTypeSOC: { type: String, default: '' }, //single or chain

  password: [{
    password: {
      type: String,
      default: ''
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




const verifiedUser = db1.model('verifiedUser', verifiedUsersSchema);
export default verifiedUser;
