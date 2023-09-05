const Group = require('../models/group');

const Member = require('../models/group-members');
const User = require('../models/user');

const sequelize = require('../utils/database');

exports.createGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = req.user;
        const groupName = req.body.groupName;
        const group = await Group.findOne({where: {name: groupName}})
        if(group) {
            await t.rollback();
            return res.status(409).json({Err: "Group already exists"});
        }
        else {
            const promise1 = await Group.create({name: groupName}, {transaction: t});
            const promise2 = await Member.create({userId: user.id, groupId: promise1.id, isAdmin: true}, {transaction: t});
            await Promise.all([promise1, promise2]);
            await t.commit();
            return res.status(200).json({Res: "Group created successfully"});
        }
        
    } catch (error) {
        await t.rollback();
        return res.status(500).json({Err: "Failed creating group"});
    }
}

exports.joinGroup = async (req, res) => {
    const user = req.user;
    const reqGroupName = req.body.groupName;
    const t = await sequelize.transaction();
    try {
        const group = await Group.findOne({where: {name: reqGroupName}});
        if(group) {
            const member = await Member.findOne({where: {userId: user.id, groupId: group.id}});
            if(member) {
                res.status(409).json({Error: "User already in group", status: '409'})
            }
            else {
                await Member.create({groupId: group.id, userId: user.id, isAdmin: false}, {transaction: t});
                await t.commit();
                res.status(201).json({Response: "Successfully joined the group", group, status: '201'})
            }    
        }
        else {
            await t.rollback();
            res.status(404).json({Error: "Group not found", status: '404'})
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({Error: error.message})
    } 
}

exports.getGroups = async (req, res) => {
    try {
        const user = req.user;
        const memberRecord = await Member.findAll({where: {userId: user.id}, attributes: ['groupId']});
        const groupIds = memberRecord.map((member) => {
            return member.groupId;
        })
        const groups = await Group.findAll({where: {id: groupIds}});
        res.status(200).json({groups});
    } catch (error) {
        res.status(500).json({Error: error.message});
    }
}

exports.getMembers = async (req, res) => {
    try {
        const groupName = req.query.group;
        const group = await Group.findOne({where: {name: groupName}, attributes: ['id']});
        const users = await Member.findAll({where: {groupId: group.id},
                                            attributes: ['userId', 'isAdmin'],
                                            include: {
                                                model: User,
                                                attributes: ['name']
                                            }
                                            });                 
        if(users) {
            res.status(200).json({users});
        }
        else {
            res.status(404).json({Error: "No members in the group"})
        }
    } catch (error) {
        res.status(500).json({Error: error.message});
    }
}

exports.getisAdmin = async (req, res) => {
    try {
        const user = req.user;
        const groupName = req.params.group;
        const group = await Group.findOne({where: {name: groupName}, attributes: ['id']});
        const member = await Member.findOne({where: {userId: user.id, groupId: group.id}, attributes: ['isAdmin']});
        if(member.isAdmin) {
            res.status(200).json({isAdmin: member.isAdmin});
        }
        else {
            res.status(404).json({Msg: "User not found"});
        }
    } catch (error) {
        res.status(500).json({Error: error.message});
    }
}   