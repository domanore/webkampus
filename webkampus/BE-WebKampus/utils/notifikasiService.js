const express = require('express')
const router = express.Router()
const Diskusi = require('../models/diskusi')
const User = require('../models/user')
const Notifikasi = require('../models/notifikasi')
const { Op } = require('sequelize')

// Utility untuk mengirim notifikasi
const kirimNotifikasi = async (userId, pesan, tipe, referensiId = null) => {
    try {
        await Notifikasi.create({
            userId,
            pesan,
            tipe,
            referensiId
        })
    } catch (error) {
        console.error('Gagal mengirim notifikasi:', error)
    }
}

// Tambah Diskusi Baru
router.post('/tambah', async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { 
            mahasiswaId, 
            dosenId, 
            topikDiskusi, 
            content 
        } = req.body

        // Validasi input
        if (!mahasiswaId || !dosenId || !topikDiskusi) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap'
            })
        }

        // Cari data mahasiswa dan dosen
        const mahasiswa = await User.findByPk(mahasiswaId)
        const dosen = await User.findByPk(dosenId)

        if (!mahasiswa || !dosen) {
            return res.status(404).json({
                success: false,
                message: 'Mahasiswa atau Dosen tidak ditemukan'
            })
        }

        // Buat diskusi
        const diskusi = await Diskusi.create({
            mahasiswaId,
            dosenId,
            topikDiskusi,
            content,
            status: 'menunggu'
        }, { transaction })

        // Kirim notifikasi ke mahasiswa
        await kirimNotifikasi(
            mahasiswaId, 
            `Pengajuan Diskusi dengan ${dosen.name} sedang diproses`, 
            'diskusi', 
            diskusi.id
        )

        // Kirim notifikasi ke dosen
        await kirimNotifikasi(
            dosenId, 
            `Pengajuan Diskusi Baru dari ${mahasiswa.name} - Topik: ${topikDiskusi}`, 
            'diskusi', 
            diskusi.id
        )

        await transaction.commit()

        res.status(201).json({
            success: true,
            message: 'Diskusi berhasil dibuat',
            diskusi
        })
    } catch (error) {
        await transaction.rollback()
        console.error('Error tambah diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal membuat diskusi'
        })
    }
})

// Jadwalkan Diskusi
router.put('/jadwalkan/:id', async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { id } = req.params
        const { 
            jadwalDiskusi, 
            lokasiDiskusi,
            status 
        } = req.body

        const diskusi = await Diskusi.findByPk(id, {
            include: [
                { model: User, as: 'Mahasiswa' },
                { model: User, as: 'Dosen' }
            ]
        })

        if (!diskusi) {
            return res.status(404).json({
                success: false,
                message: 'Diskusi tidak ditemukan'
            })
        }

        diskusi.jadwalDiskusi = jadwalDiskusi
        diskusi.lokasiDiskusi = lokasiDiskusi
        diskusi.status = status || 'disetujui'

        await diskusi.save({ transaction })

        // Kirim notifikasi ke mahasiswa
        await kirimNotifikasi(
            diskusi.mahasiswaId, 
            `Diskusi dengan ${diskusi.Dosen.name} dijadwalkan pada ${new Date(jadwalDiskusi).toLocaleString()}`, 
            'diskusi', 
            diskusi.id
        )

        // Kirim notifikasi ke dosen
        await kirimNotifikasi(
            diskusi.dosenId, 
            `Anda telah menjadwalkan diskusi dengan ${diskusi.Mahasiswa.name}`, 
            'diskusi', 
            diskusi.id
        )

        await transaction.commit()

        res.json({
            success: true,
            message: 'Jadwal diskusi berhasil diperbarui',
            diskusi
        })
    } catch (error) {
        await transaction.rollback()
        console.error('Error jadwalkan diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal menjadwalkan diskusi'
        })
    }
})

// Perbarui Status Diskusi
router.patch('/status/:id', async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { id } = req.params
        const { status } = req.body

        const diskusi = await Diskusi.findByPk(id, {
            include: [
                { model: User, as: 'Mahasiswa' },
                { model: User, as: 'Dosen' }
            ]
        })

        if (!diskusi) {
            return res.status(404).json({
                success: false,
                message: 'Diskusi tidak ditemukan'
            })
        }

        const statusLama = diskusi.status
        diskusi.status = status
        await diskusi.save({ transaction })

        // Kirim notifikasi ke mahasiswa
        await kirimNotifikasi(
            diskusi.mahasiswaId, 
            `Status diskusi dengan ${diskusi.Dosen.name} diubah dari ${statusLama} menjadi ${status}`, 
            'diskusi', 
            diskusi.id
        )

        // Kirim notifikasi ke dosen
        await kirimNotifikasi(
            diskusi.dosenId, 
            `Anda mengubah status diskusi dengan ${diskusi.Mahasiswa.name} dari ${statusLama} menjadi ${status}`, 
            'diskusi', 
            diskusi.id
        )

        await transaction.commit()

        res.json({
            success: true,
            message: 'Status diskusi diperbarui',
            diskusi
        })
    } catch (error) {
        await transaction.rollback()
        console.error('Error update status diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui status diskusi'
        })
    }
})

// Dapatkan Notifikasi Mahasiswa
router.get('/notifikasi/:mahasiswaId', async (req, res) => {
    try {
        const { mahasiswaId } = req.params
        const notifikasi = await Notifikasi.findAll({
            where: { 
                userId: mahasiswaId,
                dibaca: false
            },
            order: [['createdAt', 'DESC']]
        })

        res.json({
            success: true,
            notifikasi
        })
    } catch (error) {
        console.error('Error ambil notifikasi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil notifikasi'
        })
    }
})

module.exports = router