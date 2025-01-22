// utils/notifikasiService.js
const Notifikasi = require('../models/notifikasi')
const User = require('../models/user')

class NotifikasiService {
    // Kirim notifikasi ke pengguna tertentu
    static async kirimNotifikasi(options) {
        try {
            const {
                userId,
                tipe = 'sistem',
                pesan,
                referensiId = null
            } = options

            // Validasi input
            if (!userId || !pesan) {
                throw new Error('User ID dan Pesan harus disertakan')
            }

            // Buat notifikasi
            const notifikasi = await Notifikasi.create({
                userId,
                tipe,
                pesan,
                referensiId
            })

            return notifikasi
        } catch (error) {
            console.error('Gagal mengirim notifikasi:', error)
            throw error
        }
    }

    // Kirim notifikasi pengajuan diskusi ke dosen
    static async notifikasiPengajuanDiskusi(diskusi) {
        try {
            // Kirim notifikasi ke dosen
            await this.kirimNotifikasi({
                userId: diskusi.dosenId,
                tipe: 'diskusi',
                pesan: `Mahasiswa ${diskusi.Mahasiswa.name} mengajukan permintaan diskusi`,
                referensiId: diskusi.id
            })
        } catch (error) {
            console.error('Gagal mengirim notifikasi diskusi:', error)
        }
    }

    // Ambil notifikasi pengguna
    static async ambilNotifikasi(userId, options = {}) {
        const { 
            dibaca = null, 
            limit = 10, 
            offset = 0 
        } = options

        const whereCondition = { userId }
        
        if (dibaca !== null) {
            whereCondition.dibaca = dibaca
        }

        return await Notifikasi.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        })
    }

    // Tandai notifikasi sebagai dibaca
    static async tandaiDibaca(notifikasiId) {
        const notifikasi = await Notifikasi.findByPk(notifikasiId)
        
        if (notifikasi) {
            notifikasi.dibaca = true
            await notifikasi.save()
        }

        return notifikasi
    }
}

module.exports = NotifikasiService