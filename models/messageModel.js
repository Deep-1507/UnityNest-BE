import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    receiverId: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    senderName: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100,
    },
    receiverName: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 500,
    },
    creationDate: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Number,
        required: true,
        trim: true,
    },
}, {
    collection: 'messages', // Specify the collection name here
    timestamps:true
});


const Message = mongoose.model('Message', messageSchema);

export default Message;