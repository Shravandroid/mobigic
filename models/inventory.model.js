const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventorySchema = new Schema(
  {
    fileName: String,
    path: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    code: { type: Number, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);


const inventoryModel = mongoose.model("Inventory", inventorySchema);

module.exports = inventoryModel;
