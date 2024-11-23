const express = require("express");
const cors = require("cors");
const { MysqlConnection } = require("./database/mysqlConnection");
const UserRoute = require('./routes/route');

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", UserRoute);

const startServer = async () => {
  try {
    MysqlConnection();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.error("Error connecting to the database:", error);
  }
};

startServer();
