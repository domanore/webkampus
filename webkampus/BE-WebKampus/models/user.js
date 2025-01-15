const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig')

const User = sequelize.define('User', 
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nim: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    nidn: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    bio: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    fakultas: DataTypes.STRING,
    prodi: DataTypes.STRING,
    fotoURL: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('mahasiswa', 'dosen'),
      allowNull: false,
    }
  },
  {
    tableName: 'user',
    sequelize
  }
)

module.exports = User;