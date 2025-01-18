const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('webkampus', 'root', 'inikamupekanbaru2019', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql'
});

module.exports = sequelize;