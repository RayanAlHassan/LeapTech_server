import ServiceModel from '../models/ServicesModel.js';

// Create
export const createService = async (req, res) => {
  try {
    const { category, title, description } = req.body;
    const service = await ServiceModel.create({ category, title, description });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// Get all
export const getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Get one
export const getServiceById = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// Update
export const updateService = async (req, res) => {
  try {
    const updated = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// Delete
export const deleteService = async (req, res) => {
  try {
    const deleted = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};
