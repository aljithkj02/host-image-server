const { Router } = require('express');
const { uploadImage, getAllImages, getThumbnails, deleteImage, getSignature } = require('../controllers/gallery.controller'); 
const authorize = require('../middlewares/authorization');

const router = Router();

router.get('/', authorize, getAllImages);
router.delete('/delete-image/:id', authorize, deleteImage);
router.get('/thumbnails/:id', authorize, getThumbnails);
router.post('/upload', authorize, uploadImage );
router.get('/get-signature', authorize, getSignature);


 

module.exports = router;