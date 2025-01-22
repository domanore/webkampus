// authService.js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class AuthService {
    // Generate token
    static generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        )
    }

    // Verifikasi token
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return null
        }
    }

    // Hash password
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10)
    }

    // Bandingkan password
    static async comparePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword)
    }
}

module.exports = AuthService