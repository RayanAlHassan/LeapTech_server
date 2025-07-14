import ConsultModel from "../models/ConsultModel.js";

export const submitConsult = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      organization,
      service,
      projectDescription,
      estimatedBudget,
      projectTimeline,
      preferredContactMethod,
      bestTimeToContact
    } = req.body;

    // Validation: either company or organization must be provided
    if (!company && !organization) {
      return res.status(400).json({ message: "Either company or organization is required." });
    }

    if (company && organization) {
      return res.status(400).json({ message: "Please provide only one: company or organization." });
    }

    const consult = await ConsultModel.create({
      name,
      email,
      phone,
      company,
      organization,
      service,
      projectDescription,
      estimatedBudget,
      projectTimeline,
      preferredContactMethod,
      bestTimeToContact
    });

    res.status(201).json({ message: "Consultation submitted successfully", consult });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

import Consult from '../models/ConsultModel.js';

// GET /consult?page=1&limit=10
export const getAllConsults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 per page
    const skip = (page - 1) * limit;

    const [consults, total] = await Promise.all([
      ConsultModel.find()
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit),
      Consult.countDocuments()
    ]);

    return res.status(200).json({
      consults,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getConsultById = async (req, res) => {
  try {
    const consult = await ConsultModel.findById(req.params.id);
    if (!consult) return res.status(404).json({ message: "Consultation not found" });

    res.status(200).json(consult);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
