const mongoose = require("mongoose");
const { PRIORITIES, STATUSES } = require("../utils/validators");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        priority: {
            type: String,
            enum: PRIORITIES,
            default: "Moderate",
            required: true,
        },
        status: {
            type: String,
            enum: STATUSES,
            default: "Not Started",
            required: true,
        },
        date: {
            type: Date,
        },
        image: {
            type: String,
            trim: true,
            default: "",
        },
        imagePublicId: {
            type: String,
            trim: true,
            default: "",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        categoryId: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    },
);

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });

module.exports = mongoose.model("Task", taskSchema);
