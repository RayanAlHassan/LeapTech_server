import ConsultModel from "../models/ConsultModel.js";

import nodemailer from "nodemailer";

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
      bestTimeToContact,
    } = req.body;

    // Validation: either company or organization must be provided
    if (!company && !organization) {
      return res
        .status(400)
        .json({ message: "Either company or organization is required." });
    }

    if (company && organization) {
      return res
        .status(400)
        .json({ message: "Please provide only one: company or organization." });
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
      bestTimeToContact,
    });

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const populatedConsult = await ConsultModel.findById(consult._id).populate(
      "service"
    );

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,      // always the authenticated account
        to: process.env.EMAIL_TO, // or ADMIN_EMAIL if you want same inbox
        replyTo: email,                     // applicant’s real email
        subject: `New Consultation Request`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #fff; color: #333;">
          <h2 style="text-align: center; color: #19335d;">New Consultation Request</h2>
      
          <hr style="margin: 20px 0;" />
      
          <h4>Personal Information</h4>
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
      
          <hr style="margin: 20px 0;" />
      
          <h4>Business Info</h4>
          <p><strong>Type:</strong> ${company ? "Company" : "Organization"}</p>
          <p><strong>${company ? "Company Name" : "Organization Name"}:</strong> ${company || organization}</p>
      
          <hr style="margin: 20px 0;" />
      
          <h4>Service Requested</h4>
          <p><strong>Service Category:</strong> ${populatedConsult.service?.category}</p>
          <p><strong>Service Title:</strong> ${populatedConsult.service?.title}</p>
      
          <hr style="margin: 20px 0;" />
      
          <h4>Project Details</h4>
          <p><strong>Description:</strong><br/> ${projectDescription}</p>
          <p><strong>Estimated Budget:</strong> ${estimatedBudget || "Not provided"}</p>
          <p><strong>Timeline:</strong> ${projectTimeline || "Not provided"}</p>
      
          <hr style="margin: 20px 0;" />
      
          <h4>Contact Preferences</h4>
          <p><strong>Preferred Contact Method:</strong> ${preferredContactMethod}</p>
          <p><strong>Best Time to Contact:</strong> ${bestTimeToContact || "Not specified"}</p>
      
          <hr style="margin: 20px 0;" />
      
          <p style="font-size: 0.9rem; color: #888; text-align: center;">
            Submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      
      
      });

      return res.status(201).json({
        message: "Consultation submitted and notification email sent.",
        consult,
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
      return res.status(201).json({
        message: "Consultation saved, but failed to send email.",
        consult,
        emailError: emailError.message,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
        ConsultModel.countDocuments(),
    ]);

    return res.status(200).json({
      consults,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConsultById = async (req, res) => {
  try {
    const consult = await ConsultModel.findById(req.params.id);
    if (!consult)
      return res.status(404).json({ message: "Consultation not found" });

    res.status(200).json(consult);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
