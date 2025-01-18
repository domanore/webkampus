const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const checkEmail = require('../utils/checkEmail')
const User = require ('../models/user.js')

router.post('/mahasiswa', async (req, res) => {
    try {
        const { name, email, password, nim, confirmPassword, rememberMe } = req.body;

        if (!nim) {
            return res.status(400).json({ 
                success: false,
                error: 'NIM is required for mahasiswa.' 
            });
        }
  
        const { emailExists, nimExists } = await checkEmail(email, nim);
        if (emailExists) {
            return res.status(400).json({ 
                success: false,
                error: 'Email is already registered.' 
            });
        }
        if (nimExists) {
            return res.status(400).json({ 
                success: false,
                error: 'NIM is already registered.' 
            });
        }
        if(password !== confirmPassword){
            return res.status(400).json({ 
                success: false,
                error: 'Password and Confirm Password must be the same'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            nim,
            role: 'mahasiswa'
        });

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});
  
router.post('/dosen', async (req, res) => {
    try {
        const { name, email, password, nidn, confirmPassword, rememberMe } = req.body;
  
        if (!nidn) {
            return res.status(400).json({ 
                success: false,
                error: 'NIDN is required for dosen.' 
            });
        }

        const { emailExists, nidnExists } = await checkEmail(email, null, nidn);
        if (emailExists) {
            return res.status(400).json({ 
                success: false,
                error: 'Email is already registered.' 
            });
        }
        if (nidnExists) {
            return res.status(400).json({ 
                success: false,
                error: 'NIDN is already registered.' 
            });
        }
        if(password !== confirmPassword){
            return res.status(400).json({ 
                success: false,
                error: 'Password and Confirm Password must be the same'
            })
        }
  
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            nidn,
            role: 'dosen'
        });

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

module.exports = router