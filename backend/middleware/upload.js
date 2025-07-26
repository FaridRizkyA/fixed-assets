const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Folder sementara: uploads/tmp
const tmpPath = path.join(__dirname, "../uploads/tmp");
if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.]/g, "");
    cb(null, `${timestamp}_${cleanName}`);
  }
});

module.exports = multer({ storage });
