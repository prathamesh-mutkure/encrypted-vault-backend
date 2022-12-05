const express = require("express");
const multer = require("multer");

const { check, validationResult } = require("express-validator");
const { isSignedIn } = require("../controllers/auth_controller");
const {
  uploadFile,
  getAllFiles,
  downloadFile,
  renameFile,
  deleteFile,
} = require("../controllers/file_controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// isSignedIn middleware can be added for authentication

router.post("/file", upload.single("file"), uploadFile);

router.get("/file/:id", downloadFile);

router.get("/files", getAllFiles);

router.patch("/file/:id", renameFile);

router.delete("/file/:id", deleteFile);

module.exports = router;
