import multer from 'multer';
import path from 'path';

// Storage config for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs');
  },
  filename: (req, file, cb) => {
    // Example: 1689054731976-originalfilename.pdf
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter to accept PDF and doc/docx only (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
});

export default upload;
