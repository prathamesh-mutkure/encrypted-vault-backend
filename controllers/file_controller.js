const fs = require("fs");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const GridFile = require("../models/file_model");

exports.uploadFile = async (req, res) => {
  try {
    const { file } = req;

    const fileStream = fs.createReadStream(file.path);

    const gridFile = new GridFile({ filename: file.originalname });
    await gridFile.upload(fileStream);

    fs.unlinkSync(__dirname + "/../" + file.path);

    return res.json(gridFile);
  } catch (err) {
    console.log(err);
    return handleError(res, "Error saving file to DB", 400);
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const gridFile = await GridFile.findById(id);

    if (gridFile) {
      res.attachment(gridFile.filename);
      gridFile.downloadStream(res);
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
