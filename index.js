const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const connectDB = require('./config/db');
const userRouter = require('./routes/user');
const galleryRouter = require('./routes/gallery');

const app = express();
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to my server!' });
})

app.use('/api/user', userRouter);
app.use('/api/gallery', galleryRouter);


const serverStart = () => {
    app.listen(process.env.PORT, async () => {
        await connectDB();
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}
serverStart();