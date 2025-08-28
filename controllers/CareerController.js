
import ApplicationModel from "../models/ApplicationModel.js";
import CareerModel from "../models/CareerModel.js";
import nodemailer from "nodemailer";
import fs from "fs";

// Create career post (admin only)
export const createCareer = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      location,
      employmentType,
      experienceLevel,
      skills,
      keyResponsibilities,
    } = req.body;

    // Convert comma-separated strings to arrays if needed
    const skillsArray = skills ? (Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim())) : [];
    const responsibilitiesArray = keyResponsibilities
      ? Array.isArray(keyResponsibilities)
        ? keyResponsibilities
        : keyResponsibilities.split(",").map(r => r.trim())
      : [];

    const career = await CareerModel.create({
      title,
      description,
      status,
      location,
      employmentType,
      experienceLevel,
      skills: skillsArray,
      keyResponsibilities: responsibilitiesArray,
    });

    res.status(201).json(career);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all careers
export const getAllCareers = async (req, res) => {
  try {
    const careers = await CareerModel.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get one career by id
export const getCareerById = async (req, res) => {
  try {
    const career = await CareerModel.findById(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Apply for a position
// export const apply = async (req, res) => {
//   const { name, email, phone, careerId ,profession} = req.body;

//   try {
//     if (!name || !email || !phone) {
//       if (req.file) fs.unlinkSync(req.file.path);
//       return res.status(400).json({ message: "Name, email, and phone are required" });
//     }

//     if (!req.file) return res.status(400).json({ message: "CV file is required" });

//     const cvUrl = req.file.path;

//     const newApplication = await ApplicationModel.create({
//       name,
//       email,
//       phone,
//       careerId,
//       profession: profession || null, // save only if provided

//       cvUrl,
//     });

//     return res.status(201).json({ message: "Application submitted successfully", application: newApplication });
//   } catch (error) {
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     return res.status(500).json({ message: error.message || "Server error" });
//   }
// };

export const apply = async (req, res) => {
  const { name, email, phone, careerId, profession } = req.body;

  try {
    if (!name || !email || !phone) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    if (!req.file) return res.status(400).json({ message: "CV file is required" });

    const cvUrl = req.file.path;

    // Determine job and profession fields
    let jobTitle = "N/A";
    let applicantProfession = "N/A";

    if (careerId) {
      const career = await CareerModel.findById(careerId);
      if (career) jobTitle = career.title;
    }

    if (!careerId && profession) {
      applicantProfession = profession;
    }

    const newApplication = await ApplicationModel.create({
      name,
      email,
      phone,
      careerId: careerId || null,
      job: jobTitle,
      profession: careerId ? "N/A" : applicantProfession,
      cvUrl,
    });

    // Construct email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #fff; color: #333;">
        <h2 style="text-align: center; color: #19335d;">New Job Application</h2>

        <hr style="margin: 20px 0;" />

        <h4>Applicant Information</h4>
        <p><strong>Full Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Job:</strong> ${jobTitle}</p>
        <p><strong>Profession:</strong> ${careerId ? "N/A" : applicantProfession}</p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 0.9rem; color: #888; text-align: center;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    // Send email with CV attached
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,      // always the authenticated account
      to: process.env.EMAIL_TO, // or ADMIN_EMAIL if you want same inbox
      replyTo: email,                     // applicant’s real email
      subject: `New Job Application: ${jobTitle}`,
      html: emailHtml,
      attachments: [
        {
          filename: req.file.originalname,
          path: cvUrl,
        },
      ],
    });

    console.log("✅ Email sent with CV attached:", req.file.originalname);

    return res.status(201).json({
      message: "Application submitted successfully (email sent with CV)",
      application: newApplication,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};



// Get all applications (admin)
export const getApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ApplicationModel.countDocuments();
    const applications = await ApplicationModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ total, page, pages: Math.ceil(total / limit), applications });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error fetching applications" });
  }
};

// Get single application by ID (admin)
export const getApplicationById = async (req, res) => {
  try {
    const application = await ApplicationModel.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Error fetching application" });
  }
};


// Delete career by ID (admin only)
export const deleteCareerById = async (req, res) => {
  try {
    const career = await CareerModel.findById(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });

    // Optionally, you can also delete all applications related to this career
    // await ApplicationModel.deleteMany({ careerId: career._id });

    await career.deleteOne();

    res.json({ message: "Career deleted successfully" });
  } catch (error) {
    console.error("Delete career error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
// Update career by ID (admin only)
export const updateCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the career
    const career = await CareerModel.findById(id);
    if (!career) return res.status(404).json({ message: "Career not found" });

    // Extract fields from request body
    const {
      title,
      description,
      status,
      location,
      employmentType,
      experienceLevel,
      skills,
      keyResponsibilities,
    } = req.body;

    // Update fields if provided
    if (title) career.title = title;
    if (description) career.description = description;
    if (status) career.status = status;
    if (location) career.location = location;
    if (employmentType) career.employmentType = employmentType;
    if (experienceLevel) career.experienceLevel = experienceLevel;

    // Convert comma-separated strings to arrays if needed
    if (skills) {
      career.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
    }
    if (keyResponsibilities) {
      career.keyResponsibilities = Array.isArray(keyResponsibilities)
        ? keyResponsibilities
        : keyResponsibilities.split(",").map((r) => r.trim());
    }

    // Save updated career
    await career.save();

    res.json({ message: "Career updated successfully", career });
  } catch (error) {
    console.error("Update career error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
