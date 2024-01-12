import { Model, INTEGER, Sequelize, STRING, INET } from 'sequelize';
import { sequelize } from '../db';

export class User extends Model {
    public id!: number;
    public nonce!: number;
    public publicAddress!: string;
    public username?: string;
    public email?: string;
}

User.init(
    {
        id: {
            allowNull: false,
            type:INTEGER,
            autoIncrement: true,
            primaryKey: true  
        },
        nonce: {
            allowNull: false,
            type: INTEGER,
            defaultValue: (): number => Math.floor(Math.random() * 10000),
        },
        publicAddress: {
            allowNull: false,
            type: STRING,
            unique: true,
            validate: { isLowercase: true },
        },
        username: {
            type: STRING,
            unique: true,
        },
        email: {
            type: STRING,
            unique: true,
        },
    },
    {
        modelName: 'user',
        sequelize,
        timestamps: false,
    }
);
