const { DataTypes } = require('sequelize')
const sequelize = require('../dbConfig')

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nim: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    nidn: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('mahasiswa', 'dosen'),
        allowNull: false
    },
    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telepon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prodi: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Users',
    timestamps: true
})

module.exports = User