const fs = require("fs");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const GridFile = require("../models/file_model");
const path = require("path");
const {
  encryptBuffer,
  decryptBuffer,
} = require("../helpers/encryption-helper");

exports.uploadFile = async (req, res) => {
  try {
    const { file } = req;

    console.log(file);

    var bitmap = fs.readFileSync(file.path);
    const buffer = Buffer.from(bitmap);
    const encrypted = encryptBuffer(buffer);

    const filePath = __dirname + "/../uploads/" + file.originalname;

    fs.createWriteStream(filePath).write(encrypted);

    console.log("OK");

    const fileStream = fs.createReadStream(filePath);

    console.log("OK 2");

    const gridFile = new GridFile({ filename: file.originalname });
    await gridFile.upload(fileStream);

    console.log("OK 3");

    fs.unlinkSync(__dirname + "/../" + file.path);
    // UnlinkfilePath too

    // return res.json(gridFile);
    console.log("OK 4");

    console.log(filePath);

    res.sendFile(path.resolve(filePath));

    // res.send("lol");
  } catch (err) {
    console.log(err);
    return handleError(res, "Error saving file to DB", 400);
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const gridFile = await GridFile.findById(id);

    const filePath = __dirname + "/../uploads/" + gridFile.filename;

    const fileStream = fs.createWriteStream(filePath);

    await gridFile.download(fileStream);

    var bitmap = fs.readFileSync(filePath);
    const buffer = Buffer.from(bitmap);
    const decrypted = decryptBuffer(buffer);
    fs.createWriteStream(filePath).write(decrypted);

    if (gridFile) {
      res.sendFile(path.join("uploads", gridFile.filename), {
        root: path.join("."),
      });
    } else {
      return handleError(res, "File not found", 404);
    }
  } catch (err) {
    console.log(err);
    return handleError(res, "Error saving file to DB", 400);
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const files = await GridFile.find({});

    res.json(files);
  } catch (err) {
    return handleError(res, "Error getting files from DB", 400);
  }
};

// No Need

exports.renameFile = async (req, res) => {
  try {
    const { id } = req.params;
    const renameTo = req.body.rename_to;

    const gridFile = await GridFile.findByIdAndUpdate(
      id,
      { filename: renameTo },
      { new: true }
    );

    if (gridFile) {
      return res.json(gridFile);
    } else {
      return handleError(res, "File not found", 404);
    }
  } catch (err) {
    console.log(err);
    return handleError(res, "Error updating filename", 400);
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const gridFile = await GridFile.findByIdAndDelete(id);

    if (gridFile) {
      return res.json(gridFile);
    } else {
      res.status(404).json({ err: "File not found" });
    }
  } catch (err) {
    console.log(err);
    return handleError(res, "Error deleting file from DB", 400);
  }
};
