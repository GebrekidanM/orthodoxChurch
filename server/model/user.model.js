const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
    deleted: { type: Boolean, default: false }, // Added deleted flag
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
