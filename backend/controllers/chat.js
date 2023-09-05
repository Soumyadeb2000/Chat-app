const sequelize = require('../utils/database')

const aws = require('aws-sdk');

const fs = require('fs');

const util = require('util');

const unlinkFiles = util.promisify(fs.unlink)

const Chat = require('../models/chat');

const Sequelize = require('sequelize');

const Members = require('../models/group-members');

const Group = require('../models/group');

exports.postChat = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const activeGroup = req.params.activeGroup;
        const group = await Group.findOne({where: {name: activeGroup}});
        const message = req.body.message;
        const user = req.user;
        console.log(user);
        const userChat = await user.createChat({name: user.name, message: message, groupId: group.id}, {transaction: t});
        t.commit();
        res.status(200).json({status: 'success', userChat})  
    } catch (error) {
        t.rollback();
        res.status(500).json({status: 'fail', Error: error})
    } 
}

exports.getChat = async (req, res) => {
    try {
        const activeGroup = req.params.activeGroup;
            if(activeGroup) {
            const group = await Group.findOne({where: {name: activeGroup}});
            const lastMessageId = req.query.lastMessageId;
            if(lastMessageId) {
                const newChatData = await Chat.findAll({where: {id: {[Sequelize.Op.gt]: lastMessageId}, groupId: group.id}}, { attributes: ['name', 'id', 'message']});
                res.status(200).json({newChatData});
            }
            else {
                const chatData = await Chat.findAll({ where: {groupId: group.id}, attributes: ['name', 'id', 'message']});
                res.status(200).json({chatData});
            }
        }
    } catch (error) {
        res.status(404).json({Error: "Data not found!!"});
    }
}

exports.multimediaChat =  async (req, res) => {
    const t = await sequelize.transaction();
    try {
            const activeGroup = req.params.activeGroup;
            const group = await Group.findOne({where: {name: activeGroup}});
            const user = req.user;
            const file = req.file;
            const url = await sendToS3(file);
            await unlinkFiles(file.path);
            const userChat = await user.createChat({name: user.name, message: url, groupId: group.id}, {transaction: t});
            t.commit();
            res.status(200).json({userChat});

    } catch (error) {
        console.log(error);
        t.rollback();
        res.status(500).json({status: 'fail', Error: error})
    } 
}

async function sendToS3(file) {
    const BUCKET_NAME = 'chatappbucket1234';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    const bucket = new aws.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })
    const fileStream = fs.createReadStream(file.path)
    var params = {
        Bucket: BUCKET_NAME,
        Key: file.originalname,
        Body: fileStream,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        bucket.upload(params, (err, res) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(res.Location);
            }
        })
    })
}