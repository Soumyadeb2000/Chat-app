const User = require('../models/user')

const jwt = require('jsonwebtoken');

exports.authorize = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const jwtObject = jwt.verify(token, 'banku8840401534');
        console.log(jwtObject);
        const user = await User.findByPk(jwtObject.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({Error: "Error while authenticating!!"})
    }
}