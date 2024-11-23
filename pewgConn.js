const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({

  
// DB_HOST=MYSQL5049.site4now.net
// DB_USER=a3328c_pewgdb
// DB_PASSWORD=Kwasia123@pewg
// DB_DATABASE=db_a3328c_pewgdb

// host: process.env.DB_HOST,
// user: process.env.DB_USER,
// password: process.env.DB_PASSWORD,
// database: process.env.DB_DATABASE,

  //host:  'MYSQL5049.site4now.net',
  //user: 'a3328c_pewgdb',
  //password: 'Kwasia123@pewg',
  //database: 'db_a3328c_pewgdb',
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust according to your needs
  queueLimit: 0,
});

module.exports = { pool };

   
    