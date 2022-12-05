require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./admin_key.json");

const authRoutes = require("./routes/auth_routes");
const fileRoutes = require("./routes/file_routes");

const PORT = process.env.PORT ?? 8001;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
