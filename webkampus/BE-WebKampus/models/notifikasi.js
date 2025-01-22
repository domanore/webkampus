// models/notifikasi.js
const { DataTypes } = require('sequelize')
const sequelize = require('../dbConfig')

const Notifikasi = sequelize.define('Notifikasi', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    tipe: {
        type: DataTypes.ENUM(
            'diskusi', 
            'konsultasi', 
            'pengumuman', 
            'sistem'
        ),
        defaultValue: 'sistem'
    },
    pesan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dibaca: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    referensiId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID referensi terkait (misal ID diskusi)'
    }
}, {
    tableName: 'Notifikasi',
    timestamps: true
})

// Relasi dengan User
Notifikasi.associate = (models) => {
    Notifikasi.belongsTo(models.User, { 
        foreignKey: 'userId' 
    })
}

module.exports = Notifikasi