const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const User = require('../models/user')

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/profile-photos')
        
        // Buat direktori jika belum ada
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Tipe file tidak diizinkan'), false)
        }
    }
})

router.post('/upload-profile-photo/:id', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { id } = req.params
        
        // Cek apakah file terunggah
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tidak ada file yang diunggah' 
            })
        }

        // Temukan user
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User tidak ditemukan' 
            })
        }

        // Konstruksi URL foto
        const photoUrl = `/uploads/profile-photos/${req.file.filename}`

        // Update foto profil
        await user.update({
            profilePhoto: photoUrl
        })

        // Kirim respons
        res.status(200).json({
            success: true,
            message: 'Foto profil berhasil diperbarui',
            photoUrl: photoUrl
        })
    } catch (error) {
        console.error('Error upload foto:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengunggah foto',
            error: error.message
        })
    }
})

module.exports = router