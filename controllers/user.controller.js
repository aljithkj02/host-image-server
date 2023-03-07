const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_CLIENT_SECRET);
    return token;
}

const signupHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please enter all fields!"
            })
        }

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
                status: false,
                message: "User already exists!"
            })
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword
        };

        const savedUser = await User.create( newUser );
        const tokenObj = {
            _id: savedUser._id,
            email: savedUser.email
        }
        
        const token = generateToken(tokenObj);
        res.status(201).json({
            status: true,
            message: "User signedup successfully",
            token,
            name
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email ||!password) {
            return res.status(400).json({
                status: false,
                message: "Please enter all fields!"
            })
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                status: false,
                message: "User does not exist!"
            })
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                status: false,
                message: "Incorrect password!"
            })
        }
        const tokenObj = {
            _id: user._id,
            email: user.email
        }
        const token = generateToken(tokenObj);
        res.status(200).json({
            status: true,
            message: "User logged in successfully",
            token,
            name: user.name
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

module.exports = {
    signupHandler,
    loginHandler
}