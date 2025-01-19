const express = require('express')
const router = express.Router() // Tambahkan baris ini
const bcrypt = require('bcrypt')
const User = require('../models/user')
const checkEmail = require('../utils/checkEmail')

// Route untuk registrasi dosen
router.post('/dosen', async (req, res) => {
    // Kode registrasi dosen
})

// Route untuk registrasi mahasiswa
router.post('/mahasiswa', async (req, res) => {
    try {
        const { name, email, nim, password, confirmPassword } = req.body

        // Validasi input
        if (!name || !email || !nim || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            })
        }

        // Cek kecocokan password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password dan Konfirmasi Password tidak cocok'
            })
        }

        // Cek email dan NIM
        const { emailExists, nimExists } = await checkEmail(email, nim)

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            })
        }

        if (nimExists) {
            return res.status(400).json({
                success: false,
                message: 'NIM sudah terdaftar'
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Buat user baru
        const newUser = await User.create({
            name,
            email,
            nim,
            password: hashedPassword,
            role: 'mahasiswa'
        })

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                nim: newUser.nim,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error('Error registrasi mahasiswa:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal registrasi'
        })
    }
})

module.exports = router