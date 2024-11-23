const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('./pewgConn.js'); // Updated to use the connection pool

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype);
    return isValid ? cb(null, true) : cb(new Error('File must be an image (JPEG, PNG, GIF).'));
  },
});

// Controller Function
const NewUserData = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    gender,
    selectedArea,
    district,
    local,
    selectedProfession,
    selectedGuild,
    selectedStatus,
    studentSchool,
    studentCourse,
    studentLevel,
  } = req.body;

  // Validate required fields
  const requiredFields = {
    firstName,
    lastName,
    email,
    phone,
    gender,
    selectedArea,
    district,
    local,
    selectedProfession,
    selectedGuild,
    selectedStatus,
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({ msg: `Validation Error: ${key} is required.` });
    }
  }

  const fileName = req.file?.filename || null; // Handle optional file upload

  try {
    const connection = await pool.promise().getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();

      // Check for duplicate email, phone, and name
      const [existingEmail] = await connection.query('SELECT * FROM users3 WHERE email = ?', [email]);
      if (existingEmail.length) {
        connection.release();
        return res.status(400).json({ msg: 'Email already exists.' });
      }

      const [existingPhone] = await connection.query('SELECT * FROM users3 WHERE mobilephonenumber = ?', [phone]);
      if (existingPhone.length) {
        connection.release();
        return res.status(400).json({ msg: 'Phone number already exists.' });
      }

      const [existingName] = await connection.query(
        'SELECT * FROM users3 WHERE firstname = ? AND lastname = ?',
        [firstName, lastName]
      );
      if (existingName.length) {
        connection.release();
        return res.status(400).json({ msg: 'This person is already registered.' });
      }

      // Generate unique identifier
      const secret = Array.from(
        { length: Math.ceil(200 / 21) },
        () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
      ).join('').substring(0, 200);

      // Insert into tables
      await connection.query(
        'INSERT INTO users3 (name, firstname, lastname, gender, mobilephonenumber, email, secret) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstName, firstName, lastName, gender, phone, email, secret]
      );

      await connection.query(
        'INSERT INTO churcharea3 (churchArea, district, local, imageUrl, guild, userid, memberstatus) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [selectedArea, district, local, fileName, selectedGuild, secret, selectedStatus]
      );

      await connection.query(
        'INSERT INTO user_records3 (userid, memberstatus, email, image, secret, studentschool, studentcourse, studentlevel, profession) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [secret, selectedStatus, email, fileName, secret, studentSchool, studentCourse, studentLevel, selectedProfession]
      );

      // Commit transaction
      await connection.commit();
      connection.release();
      return res.status(201).json({ msg: 'User created successfully.' });
    } catch (error) {
      // Rollback transaction in case of error
      await connection.rollback();
      connection.release();
      console.error(`Transaction Error: ${error.message}`);
      return res.status(500).json({ msg: 'An error occurred while creating the user.', error: error.message });
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    return res.status(500).json({ msg: 'Database connection failed.', error: error.message });
  }
};

module.exports = { upload, NewUserData };
