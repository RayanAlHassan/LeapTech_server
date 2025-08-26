import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  location: { type: String },
  employmentType: { type: String }, // Full-time, Part-time, Contract
  experienceLevel: { type: String }, // Junior, Mid, Senior
  skills: { type: [String] }, // required skills
  keyResponsibilities: { type: [String] }, // key responsibilities
}, { timestamps: true });

export default mongoose.model("CareerModel", careerSchema);
