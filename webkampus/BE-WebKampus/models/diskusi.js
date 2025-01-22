// models/diskusi.js
const { DataTypes, Model } = require('sequelize')
const sequelize = require('../dbConfig')
const moment = require('moment')

class Diskusi extends Model {
    // Method untuk validasi jadwal diskusi
    static validateJadwalDiskusi(jadwalDiskusi) {
        return moment(jadwalDiskusi).isValid() && 
               moment(jadwalDiskusi).isAfter(moment())
    }

    // Method untuk menghasilkan kode unik diskusi
    static generateKodeDiskusi() {
        const prefix = 'DSK'
        const timestamp = moment().format('YYYYMMDD')
        const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
        return `${prefix}-${timestamp}-${randomSuffix}`
    }

    // Method untuk mengecek status diskusi
    isStatusValid(status) {
        const validStatuses = [
            'menunggu', 
            'disetujui', 
            'ditolak', 
            'selesai'
        ]
        return validStatuses.includes(status)
    }

    // Method untuk menghitung durasi diskusi
    hitungDurasi(waktuMulai, waktuSelesai) {
        return moment(waktuSelesai).diff(moment(waktuMulai), 'minutes')
    }
}

// Definisi model dengan opsi tambahan
Diskusi.init({
    // Tambahan field untuk detail diskusi
    kodeDiskusi: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue: () => Diskusi.generateKodeDiskusi()
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Judul diskusi harus diisi'
            },
            len: {
                args: [3, 255],
                msg: 'Judul diskusi harus antara 3-255 karakter'
            }
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Konten diskusi harus diisi'
            },
            len: {
                args: [10, 5000],
                msg: 'Konten diskusi harus antara 10-5000 karakter'
            }
        }
    },
    status: {
        type: DataTypes.ENUM(
            'menunggu', 
            'disetujui', 
            'ditolak', 
            'selesai'
        ),
        defaultValue: 'menunggu',
        validate: {
            isIn: {
                args: [['menunggu', 'disetujui', 'ditolak', 'selesai']],
                msg: 'Status diskusi tidak valid'
            }
        }
    },
    mahasiswaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'ID Mahasiswa harus diisi'
            }
        }
    },
    dosenId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    jadwalDiskusi: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isValidJadwal(value) {
                if (value && !Diskusi.validateJadwalDiskusi(value)) {
                    throw new Error('Jadwal diskusi tidak valid')
                }
            }
        }
    },
    waktuMulai: {
        type: DataTypes.DATE,
        allowNull: true
    },
    waktuSelesai: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isAfterStart(value) {
                if (this.waktuMulai && value && 
                    moment(value).isBefore(moment(this.waktuMulai))) {
                    throw new Error('Waktu selesai harus setelah waktu mulai')
                }
            }
        }
    },
    durasi: {
        type: DataTypes.INTEGER, // dalam menit
        allowNull: true,
        get() {
            // Hitung otomatis jika waktu mulai dan selesai ada
            if (this.waktuMulai && this.waktuSelesai) {
                return this.hitungDurasi(this.waktuMulai, this.waktuSelesai)
            }
            return this.getDataValue('durasi')
        }
    },
    lokasiDiskusi: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Lokasi diskusi maksimal 255 karakter'
            }
        }
    },
    topikDiskusi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Topik diskusi harus diisi'
            },
            len: {
                args: [3, 255],
                msg: 'Topik diskusi harus antara 3-255 karakter'
            }
        }
    },
    catatanDosen: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: 'Catatan dosen maksimal 1000 karakter'
            }
        }
    },
    konfirmasi: {
        type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        validate: {
            isIn: {
                args: [['menunggu', 'disetujui', 'ditolak']],
                msg: 'Status konfirmasi tidak valid'
            }
        }
    }
}, {
    sequelize,
    modelName: 'Diskusi',
    tableName: 'Diskusi',
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
        // Sebelum membuat diskusi
        beforeCreate: (diskusi) => {
            // Generate kode diskusi unik
            diskusi.kodeDiskusi = Diskusi.generateKodeDiskusi()
        },
        // Sebelum update
        beforeUpdate: (diskusi) => {
            // Hitung durasi otomatis jika waktu berubah
            if (diskusi.changed('waktuMulai') || diskusi.changed('waktuSelesai')) {
                diskusi.durasi = diskusi.hitungDurasi(
                    diskusi.waktuMulai, 
                    diskusi.waktuSelesai
                )
            }
        }
    },
    scopes: {
        // Scope untuk filter status
        menunggu: {
            where: {
                status: 'menunggu'
            }
        },
        disetujui: {
            where: {
                status: 'disetujui'
            }
        },
        // Scope untuk mahasiswa tertentu
        mahasiswa(mahasiswaId) {
            return {
                where: {
                    mahasiswaId
                }
            }
        }
    }
})

// Definisikan asosiasi
Diskusi.associate = (models) => {
    // Relasi dengan User (Mahasiswa)
    Diskusi.belongsTo(models.User, { 
        as: 'Mahasiswa', 
        foreignKey: 'mahasiswaId',
        onDelete: 'CASCADE'
    })

    // Relasi dengan User  (Dosen)
    Diskusi.belongsTo(models.User, { 
        as: 'Dosen', 
        foreignKey: 'dosenId',
        onDelete: 'SET NULL'
    })
}

module.exports = Diskusi