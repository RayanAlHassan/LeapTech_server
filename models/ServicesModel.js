import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: { type: String, required: true },  // e.g., Web, Mobile Application, Social Media
  title: { type: String, required: true },     // e.g., E-commerce, Branding
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('ServiceModel', serviceSchema);
