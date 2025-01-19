const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const sequelize = require('./dbConfig')
const app = express()
const port = 3000

// Import models
const User = require('./models/user')
const Diskusi = require('./models/diskusi')

// Middleware CORS 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Import routes
const registerEndPoint = require('./routers/register')
const loginEndPoint = require('./routers/login')
const editProfileRouter = require('./routers/editProfile')
const uploadPhotoRouter = require('./routers/uploadPhoto')
const diskusiRouter = require('./routers/diskusi')

// Routes
app.use('/register', registerEndPoint)
app.use('/login', loginEndPoint)
app.use('/edit-profile', editProfileRouter)
app.use('/', uploadPhotoRouter)
app.use('/diskusi', diskusiRouter)

// Tambahkan sinkronisasi database
sequelize.sync({ 
    alter: {
        drop: false // Hindari penghapusan tabel yang sudah ada
    },
    force: false // Hindari pembuatan ulang tabel
})
.then(() => {
    console.log('Database synchronized')
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
})
.catch(err => {
    console.error('Unable to synchronize the database:', err)
    // Log detail error
    console.error('Error Details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
    })
})