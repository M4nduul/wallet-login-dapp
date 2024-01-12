import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';

export const findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const whereClause = req.query && req.query.publicAddress ? { where: { publicAddress: req.query.publicAddress }, } : undefined;
        const users = await User.findAll(whereClause);
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, username, email } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User is not found!' });
        }
        user.username = username;
        user.email = email;
        const result = await user.save();
        res.status(200).json({ message: 'User updated!', user: result });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) {
            throw { status: 404, message: 'User is not found!' };
        }
        await User.destroy({
            where: {
                id: userId,
            },
        });
        res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
        next(error);
    }
};

export const listAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if ((req as any).user.payload.id !== +req.params.userId) {
            return res.status(401).send({ error: 'You can only access yourself' });
        }
        const user = await User.findByPk(req.params.userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if ((req as any).user.payload.id !== +req.params.userId) {
            return res.status(401).send({ error: 'You can only access yourself' });
        }

        const user = await User.findByPk(req.params.userId);
        if (!user) {
            return res.status(401).send({ error: `User with publicAddress ${req.params.userId} is not found` });
        }

        Object.assign(user, req.body);
        const result = await user.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
};
