const { DataTypes } = require('sequelize')
const sequelize = require('../dbConfig')

const Diskusi = sequelize.define('Diskusi', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Nama tabel yang direferensikan
            key: 'id'
        }
    }
}, {
    tableName: 'Diskusi',
    timestamps: true
})

module.exports = Diskusi