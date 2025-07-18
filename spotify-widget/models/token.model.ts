import mongoose, { Schema, models, model } from "mongoose";

const TokenSchema = new Schema(
  {
    widgetId: { type: String, required: true, unique: true },
    access_token: String,
    refresh_token: String,
    type: { type: String, required: true },
    status: { type: String, enum: ["pending", "active"], default: "pending" },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
  },
  { timestamps: true }
);

export default models.Token || model("Token", TokenSchema);
