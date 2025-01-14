const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const CreateRegisterModel = require('../models/register');
const RegisterModel = CreateRegisterModel('NIM', 'mahasiswa');

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, bio, telepon, fakultas, prodi, fotoURL } = req.body;

    try {
        const existingData = await RegisterModel.findOne({ where: { id } });
        
        if (existingData) {
            const bcryptPass = await bcrypt.hash(password, 10)
            await RegisterModel.update(
                { name, email, password: bcryptPass, bio, telepon, fakultas, prodi, fotoURL },
                { where: { id } }
            );
            res.status(200).json({ message: 'Data berhasil diperbarui.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses data.' });
    }
});

module.exports = router;