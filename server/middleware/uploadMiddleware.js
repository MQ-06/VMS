const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Create a unified storage config that dynamically assigns the destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (file.fieldname === 'photos') {
      uploadPath = 'uploads/vehicle-photos';
    } else if (file.fieldname === 'documents') {
      uploadPath = 'uploads/vehicle-documents';
    } else {
      return cb(new Error('Invalid field name'), false);
    }

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const multiUpload = upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'documents', maxCount: 10 }
]);

module.exports = { multiUpload };
