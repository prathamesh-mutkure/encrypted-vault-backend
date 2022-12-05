require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth_routes");
const fileRoutes = require("./routes/file_routes");

const PORT = process.env.PORT ?? 8001;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(`ERR: ${err}`);
  });

app.use("/api", authRoutes);
app.use("/api", fileRoutes);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
