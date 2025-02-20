import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decodedToken) {
            return res.status(401).json({ message: "Unauthorized"});
        }

        const user = await User.findById(decodedToken.userId).select('-password');

        if(!user) {
            return res.status(401).json({ message: "Unauthorized"});
        }
        req.user = user;
        next();
            
    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({ message: "internal server error"});
    }
}
