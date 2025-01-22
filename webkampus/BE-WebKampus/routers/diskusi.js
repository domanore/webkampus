const express = require('express')
const router = express.Router()
const Diskusi = require('../models/diskusi')
const User = require('../models/user')
const Notifikasi = require('../models/notifikasi')
const { Op } = require('sequelize')
const moment = require('moment') // Tambahkan moment untuk manipulasi waktu

// Utility untuk mengirim notifikasi (seperti sebelumnya)
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

// Tambahan: Konfirmasi Diskusi oleh Dosen
router.put('/konfirmasi/:id', async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { id } = req.params
        const { 
            status, 
            waktuMulai, 
            waktuSelesai, 
            lokasiDetail, 
            catatanDosen 
        } = req.body

        // Validasi input
        if (!['disetujui', 'ditolak'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid'
            })
        }

        // Cari diskusi
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

        // Update diskusi dengan informasi tambahan
        diskusi.konfirmasi = status
        diskusi.waktuMulai = waktuMulai
        diskusi.waktuSelesai = waktuSelesai
        diskusi.lokasiDetail = lokasiDetail
        diskusi.catatanDosen = catatanDosen
        
        // Hitung durasi
        if (waktuMulai && waktuSelesai) {
            const durasiMenit = moment(waktuSelesai).diff(moment(waktuMulai), 'minutes')
            diskusi.durasi = durasiMenit
        }

        await diskusi.save({ transaction })

        // Kirim notifikasi
        await kirimNotifikasi(
            diskusi.mahasiswaId,
            `Diskusi ${status === 'disetujui' ? 'disetujui' : 'ditolak'} pada ${moment(waktuMulai).format('DD MMMM YYYY HH:mm')}`,
            'diskusi',
            diskusi.id
        )

        await transaction.commit()

        res.json({
            success: true,
            message: 'Diskusi berhasil diperbarui',
            diskusi
        })
    } catch (error) {
        await transaction.rollback()
        console.error('Error konfirmasi diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal mengkonfirmasi diskusi'
        })
    }
})

// Tambahan: Riwayat Diskusi Komprehensif
router.get('/riwayat', async (req, res) => {
    try {
        const { 
            userId, 
            role, 
            status = null, 
            tahun = null, 
            page = 1, 
            limit = 10 
        } = req.query

        // Bangun kondisi query
        const whereCondition = {}
        if (role === 'mahasiswa') {
            whereCondition.mahasiswaId = userId
        } else if (role === 'dosen') {
            whereCondition.dosenId = userId
        }

        if (status) {
            whereCondition.konfirmasi = status
        }

        if (tahun) {
            whereCondition.createdAt = {
                [Op.between]: [
                    moment(tahun, 'YYYY').startOf('year'),
                    moment(tahun, 'YYYY').endOf('year')
                ]
            }
        }

        // Ambil riwayat diskusi
        const { count, rows } = await Diskusi.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: 'Mahasiswa', attributes: ['name'] },
                { model: User, as: 'Dosen', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: (page - 1) * limit
        })

        // Transform data untuk response
        const riwayatDiskusi = rows.map(diskusi => ({
            id: diskusi.id,
            topik: diskusi.topikDiskusi,
            mahasiswa: diskusi.Mahasiswa.name,
            dosen: diskusi.Dosen.name,
            status: diskusi.konfirmasi,
            waktuMulai: diskusi.waktuMulai,
            waktuSelesai: diskusi.waktuSelesai,
            durasi: diskusi.durasi,
            lokasi: diskusi.lokasiDetail,
            catatan: diskusi.catatanDosen
        }))

        res.json({
            success: true,
            total: count,
            halaman: page,
            totalHalaman: Math.ceil(count / limit),
            riwayat: riwayatDiskusi
        })
    } catch (error) {
        console.error('Error ambil riwayat diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil riwayat diskusi'
        })
    }
})

// Tambahan: Statistik Diskusi
router.get('/statistik', async (req, res) => {
    try {
        const { userId, role } = req.query

        // Kondisi berdasarkan role
        const whereCondition = role === 'mahasiswa' 
            ? { mahasiswaId: userId }
            : { dosenId: userId }

        // Statistik diskusi
        const statistik = {
            total: await Diskusi.count({ where: whereCondition }),
            disetujui: await Diskusi.count({ 
                where: { 
                    ...whereCondition, 
                    konfirmasi: 'disetujui' 
                } 
            }),
            ditolak: await Diskusi.count({ 
                where: { 
                    ...whereCondition, 
                    konfirmasi: 'ditolak' 
                } 
            }),
            menunggu: await Diskusi.count({ 
                where: { 
                    ...whereCondition, 
                    konfirmasi: 'menunggu' 
                } 
            })
        }

        res.json({
            success: true,
            statistik
        })
    } catch (error) {
        console.error('Error ambil statistik diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik diskusi'
        })
    }
})

// Dapatkan Notifikasi Diskusi
router.get('/notifikasi/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const notifikasi = await Notifikasi.findAll({
            where: { 
                userId,
                tipe: 'diskusi'
            },
            order: [['createdAt', 'DESC']],
            limit: 10
        })

        res.json({
            success: true,
            notifikasi
        })
    } catch (error) {
        console.error('Error ambil notifikasi diskusi:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil notifikasi diskusi'
        })
    }
})

module.exports = router