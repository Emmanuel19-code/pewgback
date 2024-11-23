const express = require('express');
//const { NewUserData } = require('../controller/NewUserdata');
//const {NewUserData} = require("./NewUserData")
//const upload = require('../utils/multerConfig');
const {upload,NewUserData} = require("../NewUserdata")

const router = express.Router();

router.post('/register-pewg-members', upload.single('image'),NewUserData);

module.exports = router;
