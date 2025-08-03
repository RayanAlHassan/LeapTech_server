// import multer from 'multer';
// import path from 'path';

// // Storage config for CV uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/cvs');
//   },
//   filename: (req, file, cb) => {
//     // Example: 1689054731976-originalfilename.pdf
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Filter to accept PDF and doc/docx only (optional)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /pdf/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only PDF and Word documents are allowed'));
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
//   fileFilter
// });


// export default upload;
import multer from 'multer';
import path from 'path';

// ====== CV Upload Setup ======
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const cvFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents are allowed'));
  }
};

export const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: cvFileFilter
});


// ====== Image Upload Setup ======
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, webp, and svg images are allowed'));
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter
});
