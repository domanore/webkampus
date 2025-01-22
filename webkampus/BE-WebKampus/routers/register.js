const express = require('express')
const router = express.Router() 
const bcrypt = require('bcrypt')
const User = require('../models/user')
const checkEmail = require('../utils/checkEmail')

// Route untuk registrasi dosen
router.post('/dosen', async (req, res) => {
    try {
        const { name, email, nidn, password, confirmPassword } = req.body

        // Validasi input
        if (!name || !email || !nidn || !password || !confirmPassword) {
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

        // Cek email dan NIDN
        const { emailExists, nidnExists } = await checkEmail(email, nidn)

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            })
        }

        if (nidnExists) {
            return res.status(400).json({
                success: false,
                message: 'NIDN sudah terdaftar'
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Buat user baru (dosen)
        const newUser = await User.create({
            name,
            email,
            nidn,
            password: hashedPassword,
            role: 'dosen',
            // Optional: tambahkan field opsional untuk dosen
            fakultas: req.body.fakultas || null,
            prodi: req.body.prodi || null,
            telepon: req.body.telepon || null
        })

        res.status(201).json({
            success: true,
            message: 'Registrasi dosen berhasil',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                nidn: newUser.nidn,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error('Error registrasi dosen:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal registrasi'
        })
    }
})

// Route untuk registrasi mahasiswa (tetap sama seperti sebelumnya)
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