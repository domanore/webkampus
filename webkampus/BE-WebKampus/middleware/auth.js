const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Model User Sequelize

// Variabel lingkungan (pastikan dotenv sudah digunakan)
require('dotenv').config();

// Controller Register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User berhasil didaftarkan', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mendaftarkan user' });
  }
};

// Controller Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah!' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
};

// Middleware Autentikasi
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke request
    next(); // Lanjut ke route berikutnya
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid!' });
  }
};

// Export semua fungsi
module.exports = {
  registerUser,
  loginUser,
  authMiddleware,
};
