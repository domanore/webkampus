const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('webkampus', 'root', 'inikamupekanbaru2019', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307
});

module.exports = sequelize;