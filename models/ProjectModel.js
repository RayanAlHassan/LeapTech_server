import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String },
    image: { type: String }, // Will store image path or URL
  },
  { timestamps: true }
);

export default mongoose.model("ProjectModel", projectSchema);
