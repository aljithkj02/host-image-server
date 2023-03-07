const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authorization = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const token = authorization && authorization.split(' ').pop();
        if(!token){
            return res.status(401).json({
                status: false,
                message: 'No token provided'
            })
        }

        jwt.verify(token, process.env.JWT_CLIENT_SECRET, async (err, data) => {
            if(err){
                return res.status(401).json({
                    status: false,
                    message: 'Invalid token'
                })
            }
            const user = await User.findOne({ _id: data._id });
            if(!user){
                return res.status(401).json({
                    status: false,
                    message: 'Invalid token'
                })
            }
            req.user = user;
            next();
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

module.exports = authorization;