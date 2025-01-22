const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { 
            name, 
            email, 
            nim, 
            password, 
            telepon, 
            fakultas, 
            prodi 
        } = req.body

        // Validasi input
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan Email wajib diisi'
            })
        }

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            })
        }

        // Siapkan data update
        const updateData = {
            name,
            email,
            telepon,
            fakultas,
            prodi
        }

        // Update password jika ada
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateData.password = hashedPassword
        }

        // Lakukan update
        await user.update(updateData)

        // Ambil data user terbaru
        const updatedUser = await User.findByPk(id, {
            attributes: { 
                exclude: ['password'] 
            }
        })

        res.status(200).json({
            success: true,
            message: 'Profil berhasil diupdate',
            user: updatedUser
        })
    } catch (error) {
        console.error('Error update profil:', error)
        
        // Tangani error email unique
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email sudah digunakan'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Gagal update profil'
        })
    }
})

module.exports = router