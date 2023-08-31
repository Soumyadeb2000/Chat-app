const sequelize = require('../utils/database')

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
