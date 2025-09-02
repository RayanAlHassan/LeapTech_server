import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
    title: { type: String, required: true }, // e.g., E-commerce, Branding
    description: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceModel", serviceSchema);
