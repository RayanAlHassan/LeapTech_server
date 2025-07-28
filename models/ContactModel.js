import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("ContactModel", contactSchema);
