import express from 'express';


import { userRouter } from './users/usersRoutes';
import { authRouter } from './authentication/authRoutes'

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/users', userRouter);
