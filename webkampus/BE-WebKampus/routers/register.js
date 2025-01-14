const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const checkEmail = require('../utils/checkEmail');
const Register = require('../models/register');

router.post('/mahasiswa', async (req, res) => {
    const {name, email, NIM, password, confirmPassword} = req.body;
    const Mahasiswa = Register("NIM", "mahasiswa");

    console.log(req.body);

    try {
        if (await checkEmail(Mahasiswa, email, 'NIM', NIM, res)) return;

        if (password === confirmPassword) {
            const bcryptPass = await bcrypt.hash(password, 10);
            const mahasiswa = await Mahasiswa.create({
                name,
                email,
                NIM,
                password: bcryptPass,
            });

            res.status(200).json({
                metadata: 'berhasil register',
                data: mahasiswa
            });
        } else {
            res.status(400).json({message: `Password tidak sama dengan Konfirmasi password`});
        }

    } catch (e) {
        res.status(400).json({message: e.message});
    }
}); // Hilangkan tanda titik koma di sini

router.post('/dosen', async (req, res) => {
    const {name, email, NIDN, password} = req.body
    const Dosen = Register("NIDN", "dosen")

    try {
        if (await checkEmail(Dosen, email, 'NIDN', NIDN, res)) return

        const bcryptPass = await bcrypt.hash(password, 10)
        const dosen = await Dosen.create({
            name,
            email,
            NIDN,
            password: bcryptPass,
        });

        res.status(200).json({
            metadata: 'berhasil register',
            data: dosen
        })

    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

module.exports = router