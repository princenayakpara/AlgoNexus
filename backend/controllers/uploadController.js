const path = require("path");

const handleUpload = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  res.json({
    message: "CSV uploaded successfully",
    file: req.file.filename,
    path: path.join("backend", "data", req.file.filename)
  });
};

module.exports = {
  handleUpload
};

