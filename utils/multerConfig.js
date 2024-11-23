//import multer from 'multer';
//import path from 'path';
//import fs from 'fs';
//import {fileURLToPath} from 'url';
//
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//const uploadDir = path.join(__dirname, '..', 'uploads');
//
//if (!fs.existsSync(uploadDir)) {
//  fs.mkdirSync(uploadDir);
//}
//
//const storage = multer.diskStorage({
//  destination: (req, file, cb) => {
//    cb(null, uploadDir);
//  },
//  filename: (req, file, cb) => {
//    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//    const ext = path.extname(file.originalname);
//    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//  },
//});
//
//const upload = multer({
//  storage,
//  limits: { fileSize: 10 * 1024 * 1024 },
//  fileFilter: (req, file, cb) => {
//    const filetypes = /jpeg|jpg|png|gif/;
//    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//    const mimetype = filetypes.test(file.mimetype);
//    if (extname && mimetype) {
//      return cb(null, true);
//    } else {
//      cb(new Error('File must be an image (JPEG, PNG, GIF)'));
//    }
//  },
//});
//
//export default upload;
const multer = require('multer');
const path = require('path');

// Define the directory where uploaded files will be stored
const uploadDir = 'uploads';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Store in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Create a unique file name
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Set file name with unique suffix
  },
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },  // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    // Allow only image file types (jpeg, jpg, png, gif)
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

module.exports = upload;
