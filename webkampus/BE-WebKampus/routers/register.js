const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const checkEmail = require('../utils/checkEmail')
const User = require ('../models/user.js')

router.post('/mahasiswa', async (req, res) => {
    try {
        const { name, email, password, nim, confirmPassword} = req.body;

        if (!nim) {
            return res.status(400).json({ error: 'NIM is required for mahasiswa.' });
        }
  
        const { emailExists, nimExists } = await checkEmail(email, nim);
        if (emailExists) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }
        if (nimExists) {
            return res.status(400).json({ error: 'NIM is already registered.' });
        }
        if(!password === confirmPassword){
            return res.status(400).json({ error: 'Password and Confirm Password must be the same'})
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            nim,
            role: 'mahasiswa'
        });
        res.status(201).json(user);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
  
router.post('/dosen', async (req, res) => {
    try {
        const { name, email, password, nidn, confirmPassword} = req.body;
  
        if (!nidn) {
            return res.status(400).json({ error: 'NIDN is required for dosen.' });
        }

        const { emailExists, nidnExists } = await checkEmail(email, nidn);
        if (emailExists) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }
        if (nidnExists) {
            return res.status(400).json({ error: 'NIDN is already registered.' });
        }
        if(!password === confirmPassword){
            return res.status(400).json({ error: 'Password and Confirm Password must be the same'})
        }
  
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            nidn,
            role: 'dosen'
        });
        res.status(201).json(user);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router