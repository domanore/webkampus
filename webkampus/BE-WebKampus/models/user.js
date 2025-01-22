// models/user.js
const { DataTypes, Model } = require('sequelize')
const sequelize = require('../dbConfig')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class User extends Model {
    // Method untuk validasi password
    isValidPassword(password) {
        return bcrypt.compareSync(password, this.password)
    }

    // Method untuk menghasilkan token JWT
    generateToken() {
        return jwt.sign(
            {
                id: this.id,
                name: this.name,
                email: this.email,
                role: this.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
    }

    // Method untuk menghasilkan refresh token
    generateRefreshToken() {
        return jwt.sign(
            {
                id: this.id
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
    }
}

// Definisi model dengan opsi tambahan
User .init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Nama harus diisi'
            },
            len: {
                args: [3, 255],
                msg: 'Nama harus antara 3-255 karakter'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Email harus diisi'
            },
            isEmail: {
                msg: 'Email tidak valid'
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
                args: [8, 255],
                msg: 'Password harus antara 8-255 karakter'
            }
        }
    },
    nim: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            len: {
                args: [0, 20],
                msg: 'NIM maksimal 20 karakter'
            }
        }
    },
    nidn: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            len: {
                args: [0, 20],
                msg: 'NIDN maksimal 20 karakter'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('mahasiswa', 'dosen'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['mahasiswa', 'dosen']],
                msg: 'Role tidak valid'
            }
        }
    },
    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Foto profil maksimal 255 karakter'
            }
        }
    },
    telepon: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 20],
                msg: 'Telepon maksimal 20 karakter'
            }
        }
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Fakultas maksimal 255 karakter'
            }
        }
    },
    prodi: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Prodi maksimal 255 karakter'
            }
        }
    }
}, {
    hooks: {
        // Sebelum membuat user
        beforeCreate: (user) => {
            // Hash password
            user.password = bcrypt.hashSync(user.password, 10)
        },
        // Sebelum update
        beforeUpdate: (user) => {
            // Hash password jika berubah
            if (user.changed('password')) {
                user.password = bcrypt.hashSync(user.password, 10)
            }
        }
    },
    sequelize,
    modelName: 'User ',
    tableName: 'Users',
    timestamps: true
})

// Definisikan asosiasi
User .associate = (models) => {
    // Relasi dengan Diskusi
    User.hasMany(models.Diskusi, {
        as: 'Diskusi',
        foreignKey: 'mahasiswaId'
    })
    User.hasMany(models.Diskusi, {
        as: 'DiskusiDosen',
        foreignKey: 'dosenId'
    })
}

module.exports = User