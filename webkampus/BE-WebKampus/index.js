const express = require('express')
const cors = require('cors')
const sequelize = require('./dbConfig')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

const registerEndPoint = require('./routers/register')
const loginEndPoint = require('./routers/login')
const editEndPoint = require('./routers/edit')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

sequelize.sync().then(() => {
  console.log('Database connected')
})

app.get('/', (req,res) => {
  res.status(200).json({
    Message : 'ok'
  })
})

app.use('/register', registerEndPoint)
app.use('/login', loginEndPoint)
app.use('/edit', editEndPoint)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})