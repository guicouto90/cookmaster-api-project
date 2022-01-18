const multer = require('multer');

const uploadFile = (id) => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
      callback(null, `${id}.jpeg`);
    },
  });
  const upload = multer({ storage });
  return upload;
};

module.exports = uploadFile;