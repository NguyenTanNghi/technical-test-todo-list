const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        contactNumber: {
            type: String,
            trim: true,
            default: "",
        },
        position: {
            type: String,
            trim: true,
            default: "",
        },
        avatar: {
            type: String,
            trim: true,
            default: "",
        },
        avatarPublicId: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.passwordHash;
                delete ret.avatarPublicId;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform(doc, ret) {
                delete ret.passwordHash;
                delete ret.avatarPublicId;
                delete ret.__v;
                return ret;
            },
        },
    },
);

module.exports = mongoose.model("User", userSchema);
