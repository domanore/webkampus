const express = require('express')
const router = express.Router()
const Diskusi = require('../models/diskusi')

router.post('/', async (req, res) => {
    try {
        const { title, content, userId } = req.body

        const diskusi = await Diskusi.create({
            title,
            content,
            userId
        })

        res.status(201).json({
            success: true,
            message: 'Diskusi berhasil dibuat',
            diskusi
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal membuat diskusi'
        })
    }
})

module.exports = router