const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const sequelize = require('./dbConfig')
const app = express()
const port = 3000

const registerEndPoint = require('./routers/register')
const loginEndPoint = require('./routers/login')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(bodyParser.json())
app.use('/register', registerEndPoint)
app.use('/login', loginEndPoint)

sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })