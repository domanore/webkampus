const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig')

const User = sequelize.define('User', 
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nama harus diisi'
        },
        len: {
          args: [2, 50],
          msg: 'Nama harus antara 2-50 karakter'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email sudah terdaftar'
      },
      validate: {
        isEmail: {
          msg: 'Format email tidak valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password harus diisi'
        },
        len: {
          args: [6, 255],
          msg: 'Password minimal 6 karakter'
        }
      }
    },
    nim: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        msg: 'NIM sudah terdaftar'
      },
      validate: {
        len: {
          args: [5, 20],
          msg: 'NIM harus antara 5-20 karakter'
        }
      }
    },
    nidn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        msg: 'NIDN sudah terdaftar'
      },
      validate: {
        len: {
          args: [5, 20],
          msg: 'NIDN harus antara 5-20 karakter'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('mahasiswa', 'dosen'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Role harus ditentukan'
        },
        isIn: {
          args: [['mahasiswa', 'dosen']],
          msg: 'Role hanya boleh mahasiswa atau dosen'
        }
      }
    }
  },
  {
    tableName: 'user',
    sequelize,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['nim']
      },
      {
        unique: true,
        fields: ['nidn']
      }
    ]
  }
)

module.exports = User;