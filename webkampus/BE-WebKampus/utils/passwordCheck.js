const User = require('../models/user');
const bcrypt = require('bcrypt');

const passwordCheck = async (identifier, password, role) => {
    try {
        // Log detail input
        console.log('Password Check Input:', { identifier, role });

        // Validasi input
        if (!identifier || !password || !role) {
            console.log('Validasi input gagal');
            return { 
                success: false, 
                message: 'Semua field harus diisi',
                user: null 
            };
        }

        // Cari user berdasarkan role dan identifier
        const user = await User.findOne({
            where: role === 'dosen' 
                ? { nidn: String(identifier) } 
                : role === 'mahasiswa'
                    ? { nim: String(identifier) }
                    : null
        });

        // Log hasil pencarian user
        console.log('User ditemukan:', user ? user.dataValues : 'Tidak ada');

        // Jika user tidak ditemukan
        if (!user) {
            return { 
                success: false, 
                message: 'User tidak ditemukan',
                user: null 
            };
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Validasi Password:', isPasswordValid);

        if (!isPasswordValid) {
            return { 
                success: false, 
                message: 'Password salah', 
                user: null 
            };
        }

        // Login berhasil
        return { 
            success: true, 
            message: 'Login berhasil', 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                nidn: user.nidn,
                nim: user.nim,
                role: user.role,
                telepon: user.telepon,
                fakultas: user.fakultas,
                prodi: user.prodi,
                profilePhoto: user.profilePhoto
            }
        };
        
    } catch (error) {
        console.error('Error in passwordCheck:', error);
        return { 
            success: false, 
            message: 'Terjadi kesalahan server', 
            user: null 
        };
    }
};

module.exports = passwordCheck;