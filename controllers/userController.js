import { getAllUsers, getUserById } from '../services/userService.js';
import {userService} from '../services/userService.js'

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



