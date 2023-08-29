const sequelize = require('../utils/database')

const Chat = require('../models/chat');

exports.postChat = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const message = req.body.message;
        const user = req.user;
        console.log(user);
        const userChat = await user.createChat({name: user.name, message: message}, {transaction: t});
        t.commit();
        res.status(200).json({status: 'success', userChat})  
    } catch (error) {
        t.rollback();
        res.status(500).json({status: 'fail', Error: error})
    } 
}

exports.getChat = async (req, res) => {
    try {
        const chatData = await Chat.findAll({ attributes: ['name', 'message']});
        res.status(200).json({chatData});
    } catch (error) {
        res.status(404).json({Error: "Data not found!!"});
    }
}