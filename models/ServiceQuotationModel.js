import mongoose from "mongoose";

const ServiceQuotationModel = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String }, // this is the textarea
    budget: { type: String ,required:true},
    expectedDate: { type: Date , required:true},
    contactMethod: {
      type: String,
      enum: ["Email", "Phone", "Visit company"],
      default: "Email",
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceModel",
        required: true,
      },
      
  },
  { timestamps: true } // This will automatically store `createdAt` and `updatedAt` (your time field)
);

export default mongoose.model("ServiceQuotationModel", ServiceQuotationModel);
