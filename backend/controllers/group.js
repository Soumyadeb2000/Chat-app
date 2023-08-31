const Group = require('../models/group');

const Member = require('../models/group-members');

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        console.log(groupName);
        const group = await Group.findOne({where: {name: groupName}})
        if(group) {
            return res.status(409).json({Err: "Group already exists"});
        }
        else {
            await Group.create({name: groupName});
            return res.status(200).json({Res: "Group created successfully"})
        }
        
    } catch (error) {
        return res.status(500).json({Err: "Failed creating group"});
    }
}

exports.joinGroup = async (req, res) => {
    const user = req.user;
    const reqGroupName = req.body.groupName;
    console.log(reqGroupName);
    try {
        const group = await Group.findOne({where: {name: reqGroupName}});
        if(group) {
            const member = await Member.findOne({where: {userId: user.id, groupId: group.id}});
            if(member) {
                res.status(409).json({Error: "User already in group", status: '409'})
            }
            else {
                await Member.create({groupId: group.id, userId: user.id});
                res.status(201).json({Response: "Successfully joined the group", group, status: '201'})
            }    
        }
        else {
            res.status(404).json({Error: "Group not found", status: '404'})
        }
    } catch (error) {
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
        console.log(groupIds);
        const groups = await Group.findAll({where: {id: groupIds}});
        res.status(200).json({groups});
    } catch (error) {
        res.status(500).json({Error: error.message});
    }
}