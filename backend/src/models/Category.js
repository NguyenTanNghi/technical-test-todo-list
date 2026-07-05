const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["status", "priority"],
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true },
);

categorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
