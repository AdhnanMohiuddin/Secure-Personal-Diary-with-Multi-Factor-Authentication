// models/userModel.js

const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otpSecret: {
        type: String,
        required: true
    },
    personalSecret: {
        type: String,
        required: true
    },
    personalQrCode: {
        type: String,
        required: true
    },
    diaryEntries: [diaryEntrySchema]
});

module.exports = mongoose.model('User', userSchema);
