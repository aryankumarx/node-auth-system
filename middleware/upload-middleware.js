const multer = require('multer');
const path = require('path');
const fs = require('fs');


// 1. Define the folder path
const uploadDir = path.join(__dirname, '../uploadFolder');

// 2. Create the folder if it doesn't exist (Self-healing code)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    // console.log('Created uploadFolder successfully!');
}


//3. Set multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // __dirname = current folder (middleware)
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