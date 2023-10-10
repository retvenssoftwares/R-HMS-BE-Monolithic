import User from '../models/user.js';

export default class userService {
  static async createUser(data) {
    try {
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password
      }
      const response = await new User(newUser).save();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};
