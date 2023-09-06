const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Chat = sequelize.define('archivedChat', {
    id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
    
    name: Sequelize.TEXT,    

    message: Sequelize.STRING
});

module.exports = Chat;