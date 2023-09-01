const sequelize = require('../utils/database');

const Sequelize = require('sequelize');

const Members = sequelize.define('member', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    isAdmin: Sequelize.BOOLEAN
});

module.exports = Members;