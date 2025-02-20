const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    
    receiverId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    
    text: { 
        type: String, 
        required: true },
    
    image: { 
        type: String, 
        default: '' },
});

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
