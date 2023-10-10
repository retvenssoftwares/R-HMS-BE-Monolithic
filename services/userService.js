import jwt from 'jsonwebtoken'
import User from '../models/user.js';


export default class userService {
  static async createUser(data) {
    try {

      // Generate a JWT token
      var newUser = {}

      newUser = {
        name: data.name,
        email: data.email,
        password: data.password
      }
      // Create a payload object containing user data
      const payload = {
        name: newUser.name
      };

      // Generate a JWT token with the payload
      const token = jwt.sign(payload, 'gcfgcgfcftcfctfctfctfctfctfcfcfcgfcghghcgcgcgccfccfcctrctcctct');

      // Add the token to the newUser object
      newUser.authToken = token;

      const response = await new User(newUser).save();
       return response;
   
    } catch (error) {
      console.log(error);
    }
  }
  static async getUsers() {
    const users = await User.find();
    return users;
  }

  static async getUsersById() {
    const users = await User.find();
    return users;
  }
}



export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};
