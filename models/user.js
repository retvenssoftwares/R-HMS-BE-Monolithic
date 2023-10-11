// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  firstName: {
    type: String,
    required: false
  },
  Role:{
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false,
  },
  designation: [{
    type: String,
    required: false
  }],
  phoneNumber: [{
    type: String,
    required: false
  }],
  hotelRcode:{
    type: String,
    required: false
  },
  authToken: {
    type: String
  },
  email: {
    type: String
  },
  password: [{
    type: String,
  }],
},
  {
    versionKey: false
  });



const User = mongoose.model('User', userSchema);

export default User;