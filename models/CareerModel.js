// models/CareerModel.js
import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
}, { timestamps: true });

export default mongoose.model('CareerModel', careerSchema);
