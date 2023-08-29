const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const sequelize = require('../utils/database');

exports.signup = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const t = await sequelize.transaction();
        const hash = await encryptPassword(password);
        const user = await User.findOne({where: {name: name, email: email, phone: phone}})
        if(!user){
            const newUser = await User.create({name: name, email: email, phone: phone, password: hash}, {transaction: t})
            await t.commit();
            res.status(201).json({newUserData: newUser});
        }
        else {
            await t.rollback();
            res.status(409).json({error: "User already exists"});
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({Error: error.message});
    }
}

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({where: {email: email}});
        bcrypt.compare(password, user.password, (err, result) => {
            if(result) {
                res.status(200).json({token: generateAccessToken(user)})
            }
            else {
                res.status(401).json({error: "Wrong Password"});
            }
        })
    } catch (error) {
        res.status(404).json({Error: "User not found!"});
    }
    
}

function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        const saltRounds = 15;
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err)
            reject(err)
            else {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err)
                    reject(err)
                    else
                    resolve(hash);
                }) 
            }
        })
    })
}

function generateAccessToken(user) {
    const jwtPasscode = 'banku8840401534';
    return jwt.sign({name: user.name, id: user.id}, jwtPasscode);
}