import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true }, // e.g., Web, Mobile Application
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('CategoryModel', categorySchema);
