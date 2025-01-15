import mongoose from "mongoose";

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
    timestamps:true
});

const Company = mongoose.model('Company', companySchema);

export default Company;