import ServiceQuotationModel from "../models/ServiceQuotationModel.js";

// Create a new quotation
export const createQuotation = async (req, res) => {
  try {
    const newQuotation = new ServiceQuotationModel(req.body);
    const savedQuotation = await newQuotation.save();
    res.status(201).json(savedQuotation);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit quotation", details: err.message });
  }
};

// Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await ServiceQuotationModel.find().populate("service");
    res.status(200).json(quotations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotations", details: err.message });
  }
};

// Get single quotation by ID
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await ServiceQuotationModel.findById(req.params.id).populate("service");
    if (!quotation) return res.status(404).json({ error: "Quotation not found" });
    res.status(200).json(quotation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotation", details: err.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const deleted = await ServiceQuotationModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Quotation not found" });
    res.status(200).json({ message: "Quotation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quotation", details: err.message });
  }
};
