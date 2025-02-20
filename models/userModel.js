import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name: { 
        type: String, 
        required: true, },

    email: 
    { type: String, 
        required: true, 
        unique: true },

    password: { 
        type: String, 
        required: true },

    profilePic: { 
        type: String, 
        default: '' 
    },
},
{ timestamps: true },
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
