import ServiceQuotationModel from "../models/ServiceQuotationModel.js";

// Create a new quotation
// export const createQuotation = async (req, res) => {
//   try {
//     console.log("Received quotation data:", req.body);
//     const newQuotation = new ServiceQuotationModel(req.body);
//     const savedQuotation = await newQuotation.save();
//     res.status(201).json(savedQuotation);
//   } catch (err) {
//     console.error("Error creating quotation:", err);
//     res.status(500).json({ error: "Failed to submit quotation", details: err.message });
//   }
// };

import nodemailer from "nodemailer";

// Create a new quotation and send admin email
export const createQuotation = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      message,
      budget,
      expectedDate,
      contactMethod,
      service,
    } = req.body;

    // Save quotation to DB
    const quotation = await ServiceQuotationModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      message,
      budget,
      expectedDate,
      contactMethod,
      service,
    });

    // Populate service for email
    // const populatedQuotation = await ServiceQuotationModel.findById(quotation._id).populate("service");
    const populatedQuotation = await ServiceQuotationModel.findById(quotation._id)
    .populate({
      path: "service",
      populate: { path: "category" }
    });
    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    try {
      await transporter.sendMail({
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: `New Quotation Request`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #fff; color: #333;">
            <h2 style="text-align: center; color: #19335d;">New Quotation Request</h2>
        
            <hr style="margin: 20px 0;" />
        
            <h4>Personal Information</h4>
            <p><strong>Full Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        
            <hr style="margin: 20px 0;" />
        
            <h4>Service Details</h4>
            <p><strong>Service Category:</strong> ${populatedQuotation.service?.category?.title || "N/A"}</p>
            <p><strong>Service Title:</strong> ${populatedQuotation.service?.title || "N/A"}</p>
        
            <hr style="margin: 20px 0;" />
        
            <h4>Project Info</h4>
            <p><strong>Message:</strong><br/> ${message || "Not provided"}</p>
            <p><strong>Budget:</strong> ${budget || "Not provided"}</p>
            <p><strong>Expected Date:</strong> ${expectedDate ? new Date(expectedDate).toLocaleDateString() : "Not provided"}</p>
        
            <hr style="margin: 20px 0;" />
        
            <h4>Contact Preferences</h4>
            <p><strong>Preferred Contact Method:</strong> ${contactMethod}</p>
        
            <hr style="margin: 20px 0;" />
        
            <p style="font-size: 0.9rem; color: #888; text-align: center;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      });

      return res.status(201).json({
        message: "Quotation submitted and email sent to admin.",
        quotation,
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
      return res.status(201).json({
        message: "Quotation saved, but failed to send email.",
        quotation,
        emailError: emailError.message,
      });
    }
  } catch (err) {
    console.error("Error saving quotation:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await ServiceQuotationModel.find().populate("service").sort({ createdAt: -1 });
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
