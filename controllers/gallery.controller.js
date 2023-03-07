const cloudinary = require('cloudinary').v2;
const fs  = require('fs');
const Gallery = require('../models/gallery.model');


const uploadImage = async (req, res) => {
    try {
        const image = req.file.path;
        if (!image) {
            return res.status(400).json({ 
                status: false,
                message : 'No file was uploaded.' 
            });
        }
        const result = await cloudinary.uploader.upload(image, {
            folder: 'uploads',
            transformation: [
                { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { width: 600, height: 600, crop: 'fill', gravity: 'face' }
            ]
        });

        const imageUrl = result.secure_url;
        const thumbnail1Url = cloudinary.url(result.public_id, { width: 500, height: 500, crop: 'limit' });
        const thumbnail2Url = cloudinary.url(result.public_id, { width: 250, height: 250, crop: 'limit' });
        const thumbnail3Url = cloudinary.url(result.public_id, { width: 100, height: 100, crop: 'limit' });
        
        if(!result){
            return res.status(400).json({ 
                status: false,
                message : 'No file was uploaded.' 
            });
        }

        // Deleting image from upload folder
        fs.unlink(image, (err) => {
            if(err) console.log(err);
        })

        const gallery = await Gallery.create({
            img: imageUrl,
            thumbnail_1: thumbnail1Url,
            thumbnail_2: thumbnail2Url,
            thumbnail_3: thumbnail3Url,
            author_id: req.user._id
        })

        return res.status(200).json({ 
            status: true,
            message : 'Image uploaded successfully.',
            gallery
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            status: false,
            message: 'Server error'
        });  
    }
}   

const getAllImages = async (req, res) => {
    try {
        const images = await Gallery.find({ author_id: req.user._id });
        return res.status(200).json({ 
            status: true,
            message : 'Images fetched successfully.',
            data: images
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            status: false,
            message: 'Server error'
        }); 
    }
}

const getThumbnails = async (req, res) => {
    try {
        const id = req.params.id;
        const images = await Gallery.find({ _id : id });
        return res.status(200).json({ 
            status: true,
            message : 'Images fetched successfully.',
            data: images
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            status: false,
            message: 'Server error'
        }); 
    }
}

const deleteImage = async (req, res) => {
    try {
        const id = req.params.id;

        await Gallery.findByIdAndDelete({ _id : id });
        return res.status(200).json({ 
            status: true,
            message : 'Image deleted successfully.'
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            status: false,
            message: 'Server error'
        }); 
    }
}

module.exports = {
    uploadImage,
    getAllImages,
    getThumbnails,
    deleteImage
}