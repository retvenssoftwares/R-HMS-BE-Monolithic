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
  authToken: {
    type: String
  },
  email: {
    type: String
  },
  numberOfProperties: [{
    type: Number,
    default: 0
  }],
  password: [{
    type: String,
  }],
},
  {
    versionKey: false
  });

const User = mongoose.model('User', userSchema);

export default User;