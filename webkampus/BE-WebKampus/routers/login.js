const express = require('express');
const router = express.Router();
const passwordCheck = require('../utils/passwordCheck');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    console.log('Login Request:', { 
      identifier, 
      role, 
      passwordLength: password.length 
    });

    const user = await User.findOne({
      where: role === 'mahasiswa' 
        ? { nim: String(identifier) } 
        : { nidn: String(identifier) }
    });

    console.log('User Found:', user);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }

    const { success, message, user: authenticatedUser } = await passwordCheck(
      role === 'mahasiswa' ? identifier : null,
      role === 'dosen' ? identifier : null,
      password
    );

    if (!success) {
      return res.status(400).json({ success, message });
    }

    res.status(200).json({ 
      success, 
      message, 
      user: {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: authenticatedUser.role
      }
    });

  } catch (error) {
    console.error('Detailed Login Error:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server', 
      errorDetail: error.message 
    });
  }
});

module.exports = router;