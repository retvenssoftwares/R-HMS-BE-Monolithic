import { getAllUsers, getUserById } from '../services/userService.js';

export const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

export const getUser = async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
};