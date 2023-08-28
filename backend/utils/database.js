const Sequelize = require('sequelize');

const sequelize = new Sequelize('chat_app', 'root', 'Monuking@12', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;