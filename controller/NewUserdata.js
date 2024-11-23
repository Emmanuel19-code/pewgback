const { GenerateUniquId } = require("../utils/generateUniqueId");
const { conn } = require("../database/mysqlConnection");

const NewUserData = async (req, res) => {
  const {
    title,
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
  console.log(req.body);

  // Check if any required fields are missing
  if (
    !title ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !gender ||
    !selectedArea ||
    !district ||
    !local ||
    !selectedProfession ||
    !selectedGuild ||
    !selectedStatus
  ) {
    return res.status(400).json({
      msg: "Please provide the missing details",
    });
  }

  try {
    const checkDuplicateEmail = "SELECT * FROM users1 WHERE email = ?";
    const [existingEmail] = await conn
      .promise()
      .query(checkDuplicateEmail, [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const checkDuplicatePhone =
      "SELECT * FROM users1 WHERE mobilephonenumber = ?";

    const [existingPhone] = await conn
      .promise()
      .query(checkDuplicatePhone, [phone]);

    if (existingPhone.length > 0) {
      return res.status(400).json({ msg: "Phone number already exists" });
    }

    const checkName = "SELECT * FROM users1 WHERE firstname = ? and lastname = ?";
    const [existingName] = await conn.promise().query(checkName, [firstName, lastName]);
    if (existingName.length > 0) {
      return res.status(400).json({
        msg: "This person is already registered",
      });
    }

    let secret = GenerateUniquId();

    // Default to null if no file is uploaded
    const imageFilename = req?.file?.filename || null;

    const InsertNewUser = `INSERT INTO users1 (title,name, firstname, lastname, gender, mobilephonenumber, email, secret) 
                          VALUES (?,?, ?, ?, ?, ?, ?, ?)`;
    const InsertChurchArea = `INSERT INTO churcharea1 (churchArea, district, local, imageUrl, guild, userid, memberstatus) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const InsertIntoUserRecord = `INSERT INTO user_records1 (userid, memberstatus, email, image, secret, studentschool, studentcourse, studentlevel, profession) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await conn
      .promise()
      .query(InsertNewUser, [
        title,
        firstName,
        firstName,
        lastName,
        gender,
        phone,
        email,
        secret,
      ]);

    await conn
      .promise()
      .query(InsertChurchArea, [
        selectedArea,
        district,
        local,
        imageFilename, // use imageFilename (null if no image uploaded)
        selectedGuild,
        secret,
        selectedStatus,
      ]);

    await conn
      .promise()
      .query(InsertIntoUserRecord, [
        secret,
        selectedStatus,
        email,
        imageFilename, // use imageFilename (null if no image uploaded)
        secret,
        studentSchool,
        studentCourse,
        studentLevel,
        selectedProfession,
      ]);

    return res.status(200).json({
      msg: "User created successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      msg: "Error occurred",
      error: error.message,
    });
  }
};

module.exports = { NewUserData };
