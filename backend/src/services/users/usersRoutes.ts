import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './usersController';

export const userRouter = express.Router();

// Check user is exist with publicAdress
userRouter.get('/', controller.findUser);
userRouter.get('/:userId', jwt(config), controller.get);
userRouter.patch('/:userId', jwt(config), controller.patch);

// Create signup user
userRouter.post('/', controller.signUpUser);
// Update user
userRouter.put('/', controller.updateUser);
// Delete  user
userRouter.delete('/', controller.deleteUser);

// Get all users
userRouter.get('/list', controller.listAllUsers);

