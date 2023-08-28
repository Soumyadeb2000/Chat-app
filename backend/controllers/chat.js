const sequelize = require('../utils/database')

exports.postChat = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const message = req.body.message;
        const user = req.user;
        console.log(user);
        const userChat = await user.createChat({message: message}, {transaction: t});
        t.commit();
        res.status(200).json({status: 'success', userChat: userChat})  
    } catch (error) {
        t.rollback();
        res.status(500).json({status: 'fail', Error: error})
    } 
}