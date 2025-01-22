// models/history.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const History = sequelize.define('History', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mahasiswaId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    dosenId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    topikDiskusi: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING
    }
})

module.exports = History