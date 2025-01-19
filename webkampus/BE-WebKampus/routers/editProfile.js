const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, nim, nidn, role, profilePhoto, telepon, fakultas, prodi } = req.body

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            })
        }

        await user.update({
            name,
            email,
            nim,
            nidn,
            role,
            profilePhoto,
            telepon,
            fakultas,
            prodi
        })

        res.status(200).json({
            success: true,
            message: 'Profil berhasil diupdate',
            user
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal update profil'
        })
    }
})

module.exports = router