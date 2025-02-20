import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import { z } from 'zod';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

const signupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signup = async (req, res) => {
    const { name, email, password, } = signupSchema.parse(req.body);
    try {
        const user = await userModel.findOne({email})

        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt (10)
        const hashedPassword = await bcrypt.hash (password, salt)
        
        const newUser = new userModel({
        name,
        email,
        password: hashedPassword
        })
        if (newUser) {
            try {
                generateToken(newUser._id, res);
                await newUser.save()
                res.status(201).json({ message: "User created successfully", user: newUser });
            } catch (error) {
                return res.status(500).json({ message: "Error saving user or generating token"});
            }
        } else {
            return res.status(400).json({ message: "User not created" });
        }


    } catch (error) {
        res.status(500).json({ message:"internal server error" });
    }
}

export const login = async(req,res) => {
    const {email, password} = loginSchema.parse(req.body);
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        generateToken(user._id, res);

        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logout = (req,res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0});
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log({ message: error.message });
        res.json({ message: "internal server error"});
    }
}


export const updataProfile = async (req,res) => {
    try {
        const { profilePic } = req.body;
       const userId = req.user._id
        
       if(!profilePic){
        return res.status(400).json({ message: " Profile pic is required"})
       }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

       const updateuser = await userModel.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url})

       if(!updateuser){
        return res.status(400).json({ message: "User not found"})
       }
       
       
    } catch (error) {   
        console.log({ message: error.message });
        res.status(500).json({ message: "internal server error"});
    }
}
