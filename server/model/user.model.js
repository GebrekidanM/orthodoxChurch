const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['main','admin', 'editor', 'user'], default: 'user' },
    image: { type: String, default: "default.jpg" },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
