import mongoose from "mongoose";

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
    timestamps:true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;