import mongoose from "mongoose";

const consultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  company: { type: String, default: null },
  organization: { type: String, default: null },

  service: {
    type: String,
    enum: [
      'Web Development',
      'Mobile App',
      'Software Integration',
      'Social media',
      'Marketing',
      'Branding'
    ],
    required: true,
  },

  projectDescription: { type: String },
  estimatedBudget: { type: String },
  projectTimeline: { type: String },

  preferredContactMethod: {
    type: String,
    enum: ['Email', 'Phone', 'Visit company'],
  },
  bestTimeToContact: { type: String },
}, { timestamps: true });

export default mongoose.model("ConsultModel", consultSchema);
