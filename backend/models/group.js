const sequelize = require('../utils/database');

const Sequelize = require('sequelize');

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
    
});

module.exports = Group;