const multer = require("multer");

// Image Upload
const profileUpload = multer({
  limit: {
    // File size: max 5MB
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    // Only accept three file types
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(null, false);
    }
    cb(null, true);
  },
});

module.exports = {
  profileUpload,
};
