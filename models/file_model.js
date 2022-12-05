const mongoose = require("mongoose");
const schema = require("gridfile");

const GridFile = mongoose.model("GridFile", schema);

module.exports = GridFile;
