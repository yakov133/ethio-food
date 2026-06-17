const path = require("path");

// UPLOAD_DIR keeps the current local uploads folder as the default, while letting Render mount persistent storage later.
const uploadDirectory = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(__dirname, "uploads");

module.exports = {
  uploadDirectory,
};
