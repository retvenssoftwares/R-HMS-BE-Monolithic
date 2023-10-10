// models/user.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  authToken: {
    type:String
  }
},
  {
    versionKey: false
  });

const User = mongoose.model('User', userSchema);

export default User;