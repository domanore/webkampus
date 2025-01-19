const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_NAME || 'webkampus',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'inikamupekanbaru2019', 
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3307,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true
        }
    }
)

module.exports = sequelize