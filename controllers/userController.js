import userService from '../services/userService.js'

export default class user {
  static async apiCreateUser(req, res, next) {
    try {
      const createdUser = await userService.createUser(req.body);
      res.json(createdUser);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  
}



export const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

export const getUser = async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
};