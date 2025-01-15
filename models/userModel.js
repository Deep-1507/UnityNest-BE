import mongoose from 'mongoose';

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
        min:0
    },
}, {
    collection: 'users', // Specify the collection name here
    timestamps:true
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Static method for verifying password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;