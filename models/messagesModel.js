import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
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
    companyId: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    timestamp: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
}, {
    collection: 'conversationmessages', // Specify the collection name here
    timestamps:true
});

const Messages = mongoose.model('Messages', messagesSchema);

export default Messages;