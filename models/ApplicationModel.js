import mongoose from 'mongoose';

const careerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerModel', required: false },
  cvUrl: { type: String, required: true }, // path to CV file on server
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ApplicationModel', careerApplicationSchema);
