import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log('Connected to the Database'))
.catch((error) => console.log('Error Connecting to Databse',error))

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    companyID: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    position: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    positionseniorityindex: {
        type: Number,
        required: true,
    },
}, {
    collection: 'users', // Specify the collection name here
});

// Task Schema
const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    subordinateId: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    companyId: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    taskassigneename: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    task: {
        type: String,
        required: true,
        trim: true,
    },
    submissiondateandtime: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Number,
        required: true,
        trim: true,
    },
    completedtaskmessage: {
        type: String,
        trim: true,
    },
}, {
    collection: 'tasks', // Specify the collection name here
});

// Message Schema
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
});

// Conversation Messages Schema
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
});

// Company Schema
const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    state: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    location: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
}, {
    collection: 'companies',
});

// Define Models
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const Message = mongoose.model('Message', messageSchema);
const Messages = mongoose.model('Messages', messagesSchema);
const Company = mongoose.model('Company', companySchema);

// Export Models
export {
    User,
    Task,
    Message,
    Messages,
    Company,
};