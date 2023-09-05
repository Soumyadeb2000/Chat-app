const Group = require('../models/group');

const Member = require('../models/group-members');

const User = require('../models/user');

const sequelize = require('../utils/database');

exports.addToGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const groupName = req.body.group;
        const name = req.body.name;
        const user = User.findOne({where: {name: name}, attributes: ['id']});
        const group = Group.findOne({where: {name: groupName}, attributes: ['id']});
        console.log(Promise.all(user, group));
        const member = await Member.findOne({where: {userId: user.id, groupId: group.id}})
        if(member) {
            await t.rollback();
            res.status(403).json({Message: "User already a member"});
        }
        else {
            await Member.create({userId: user.id, groupId: group.id, isAdmin: false}, {transaction: t});
            await t.commit();
            res.status(201).json({Status: "Added to group"});   
        }
             
    } catch (error) {
        await t.rollback();
        res.status(407).json({Error: error.message});      
    }
};

exports.removeMember = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const groupName = req.query.group;
        const memberId = req.params.id;
        const group = await Group.findOne({where: {name: groupName}, attributes: ['id']});
        await Member.destroy({where: {userId: memberId, groupId: group.id}, transaction: t});
        await t.commit();
        res.status(200).json({message: "Removed member from group"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({Error: error.message}); 
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const memberId = req.params.Id;
        const groupName = req.query.group;
        const group = await Group.findOne({where: {name: groupName}});
        await Member.update({isAdmin: true}, {where: {userId: memberId, groupId: group.id}});
        res.status(201).json({Message: "Created Admin successfully"});
    } catch (error) {
        res.status(500).json({Error: error.message});
    }
}
