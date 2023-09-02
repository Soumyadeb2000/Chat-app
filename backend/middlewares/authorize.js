const { log } = require('console');
const User = require('../models/user')

const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.authorize = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const jwtObject = jwt.verify(token, process.env.JWT_CODE);
        const user = await User.findByPk(jwtObject.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({Error: "Error while authenticating!!"})
    }
}