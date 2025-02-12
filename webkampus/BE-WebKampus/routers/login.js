const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passwordCheck = require('../utils/passwordCheck')

router.post('/', async (req, res) => {
    try {
        const { nidn, nim, password } = req.body
        let identifier, role

        // Tentukan identifier dan role berdasarkan input
        if (nidn) {
            identifier = nidn
            role = 'dosen'
        } else if (nim) {
            identifier = nim
            role = 'mahasiswa'
        } else {
            return res.status(400).json({
                success: false,
                message: 'NIDN atau NIM harus diisi'
            })
        }

        // Gunakan fungsi passwordCheck untuk validasi
        const result = await passwordCheck(identifier, password, role)

        if (result.success) {
            res.status(200).json({
                success: true,
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    profilePhoto: result.user.profilePhoto, // Tambahkan ini
                    nim: result.user.nim,
                    nidn: result.user.nidn
                }
            })
        }
    } catch (error) {
        console.error('Error login:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal login'
        })
    }
})

module.exports = router