const Image = require('../models/image');
const uploadToCloudinary = require('../helpers/cloudinary-helper');
const fs = require('fs');
// FIXED: Removed .v2 because your config file already exports it
const cloudinary = require('../config/cloudinary'); 

const uploadImage = async(req, res) => {
    try {
        // Check if file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                success: false, // Fixed typo: 'sucess' -> 'success'
                message: 'File is required. Please upload an Image'
            });
        }

        // Upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        // Store the image url and publicId along with the uploaded userId in db
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.user.userId
        });

        await newlyUploadedImage.save();

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            success: true,
            message: 'Image Uploaded!',
            image: newlyUploadedImage
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

const fetchImages = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // default page 1
        const limit = parseInt(req.query.limit) || 5; // default 5 images per page 
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt'; // default to createdAt
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;// default to descending order
        const totalImages = await Image.countDocuments({ uploadedBy: req.user.userId });
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find({ uploadedBy: req.user.userId })
            .sort(sortObj)
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: totalPages,
            totalImages: totalImages,
            data: images
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

const deleteImage = async(req, res) => {
    try {
        const getCurrentImageToDeleted = req.params.id;

        const image = await Image.findById(getCurrentImageToDeleted);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete image from cloudinary
        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        // Delete image from mongo db
        await Image.findByIdAndDelete(getCurrentImageToDeleted);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

module.exports = {
    uploadImage,
    fetchImages,
    deleteImage
};