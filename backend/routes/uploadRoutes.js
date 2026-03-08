const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { handleUpload } = require("../controllers/uploadController");

const router = express.Router();

const PROJECT_ROOT = path.join(__dirname, "..", "..");
const DATA_DIR = path.join(PROJECT_ROOT, "backend", "data");

const storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    cb(null, DATA_DIR);
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    file.originalname.toLowerCase().endsWith(".csv") ||
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

router.post("/", upload.single("file"), handleUpload);

module.exports = router;

