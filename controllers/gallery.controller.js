const cloudinary = require('cloudinary').v2;
const fs  = require('fs');
const Gallery = require('../models/gallery.model');


const uploadImage = async (req, res) => {
    try {
        const { public_id, version, signature, image } = req.body;

        const expectedSignature = cloudinary.utils.api_sign_request({ 
            public_id: public_id, version: version 
        }, process.env.CLOUDINARY_API_SECRET);

        if (expectedSignature === signature) {
            const thumbnail1Url = cloudinary.url(public_id, { width: 500, height: 500, crop: 'limit' });
            const thumbnail2Url = cloudinary.url(public_id, { width: 250, height: 250, crop: 'limit' });
            const thumbnail3Url = cloudinary.url(public_id, { width: 100, height: 100, crop: 'limit' });

            const gallery = await Gallery.create({
                img: image,
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
        }else{
            if(!result){
                return res.status(400).json({ 
                    status: false,
                    message : 'No file was uploaded.' 
                });
            }
        }

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

const getSignature = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp
            },
            process.env.CLOUDINARY_API_SECRET
        )

        res.status(200).json({
            timestamp,
            signature
        })
        
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
    deleteImage,
    getSignature
}