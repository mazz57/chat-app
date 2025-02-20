import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, res) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({
        userId
        }, secret, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return token;
}