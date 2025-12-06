const multer = require('multer');
const path = require('path');

// Set multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // FIXED: Use absolute path to guarantee the folder is found
        // __dirname = current folder (middleware)
        // '..' = go up one level to root
        // 'uploadFolder' = the folder name
        cb(null, path.join(__dirname, '../uploadFolder'));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('This is not an image. Please Upload an image'));
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024   // 5MB file size limit
    }
});