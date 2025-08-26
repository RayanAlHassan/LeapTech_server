// // controllers/careerController.js

// import ApplicationModel from "../models/ApplicationModel.js";
// import CareerModel from "../models/CareerModel.js";

// import fs from 'fs';



// // Create career post (admin only)
// export const createCareer = async (req, res) => {
//   try {
//     const { title, description, status } = req.body;
//     const career = await CareerModel.create({ title, description, status });
//     res.status(201).json(career);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get all careers (open and closed)
// export const getAllCareers = async (req, res) => {
//   try {
//     const careers = await CareerModel.find().sort({ createdAt: -1 });
//     res.json(careers);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get one career by id
// export const getCareerById = async (req, res) => {
//   try {
//     const career = await CareerModel.findById(req.params.id);
//     if (!career) return res.status(404).json({ message: "Career not found" });
//     res.json(career);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };



// //apply for a position
// export const apply = async (req, res) => {
//   const { name, email, phone, careerId } = req.body;

//   try {
//     // Check required fields
//     if (!name || !email || !phone) {
//       // If file was uploaded but required fields missing, delete the uploaded file
//       if (req.file) {
//         const path = `uploads/cvs/${req.file.filename}`;
//         if (fs.existsSync(path)) {
//           fs.unlinkSync(path);
//         }
//       }
//       return res.status(400).json({ message: 'Name and email and phone  are required' });
//     }

//     // CV file is required
//     if (!req.file) {
//       return res.status(400).json({ message: 'CV file is required' });
//     }

//     const cvUrl = req.file.path; // full path to saved CV

//     // Create application document
//     const newApplication = await ApplicationModel.create({
//       name,
//       email,
//       phone,
//       careerId,
//       cvUrl,
//     });

//     return res.status(201).json({
//       message: 'Application submitted successfully',
//       application: newApplication,
//     });
//   } catch (error) {
//     console.error('Apply error:', error);

//     // Cleanup uploaded file on server error
//     if (req.file) {
//       const path = `uploads/cvs/${req.file.filename}`;
//       if (fs.existsSync(path)) {
//         fs.unlinkSync(path);
//       }
//     }

//     return res.status(500).json({ message: error.message || 'Server error' });
//   }
// };




// // Optional: Get all applications with pagination (for admin)

// export const getApplications = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const total = await ApplicationModel.countDocuments();
//     const applications = await ApplicationModel.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     res.json({
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//       applications,
//     });
//   } catch (error) {
//     console.error("Error in getApplications:", error);
//     res.status(500).json({ message: error.message || "Error fetching applications" });
//   }
  
// };

// // Optional: Get single application by ID

// export const getApplicationById = async (req, res) => {
//   try {
//     const application = await ApplicationModel.findById(req.params.id);
//     if (!application)
//       return res.status(404).json({ message: "Application not found" });
//     res.json(application);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching application" });
//   }
// };
import ApplicationModel from "../models/ApplicationModel.js";
import CareerModel from "../models/CareerModel.js";
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
export const apply = async (req, res) => {
  const { name, email, phone, careerId } = req.body;

  try {
    if (!name || !email || !phone) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    if (!req.file) return res.status(400).json({ message: "CV file is required" });

    const cvUrl = req.file.path;

    const newApplication = await ApplicationModel.create({
      name,
      email,
      phone,
      careerId,
      cvUrl,
    });

    return res.status(201).json({ message: "Application submitted successfully", application: newApplication });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
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
