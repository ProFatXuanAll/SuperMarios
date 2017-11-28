const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
    account: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', userSchema);
