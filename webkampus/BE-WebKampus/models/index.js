const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const sequelize = require('./dbConfig')
const fs = require('fs')

const app = express()
const port = 3000

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Pastikan direktori uploads ada
const uploadsDir = path.join(__dirname, 'uploads', 'profile-photos')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Import models
const User = require('./models/user')
const Diskusi = require('./models/diskusi')

// Import routes
const registerRoutes = require('./routers/register')
const loginRoutes = require('./routers/login')
const editProfileRoutes = require('./routers/editProfile')
const uploadPhotoRoutes = require('./routers/uploadPhoto')
const diskusiRoutes = require('./routers/diskusi')

// Routes
app.use('/register', registerRoutes)
app.use('/login', loginRoutes)
app.use('/edit-profile', editProfileRoutes)
app.use('/', uploadPhotoRoutes)
app.use('/diskusi', diskusiRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: err.message
    })
})

// Database synchronization
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized successfully')
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.error('Database synchronization error:', err)
    })