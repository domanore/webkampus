const express = require('express')
const router = express.Router()
const passwordCheck = require('../utils/passwordCheck')
const session = require('express-session')

router.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}))

router.post('/mahasiswa', async (req, res) => {
    const { NIM, password } = req.body

    try {
        const user = await passwordCheck("NIM", "mahasiswa", NIM, password, res)
        if(user) {
            res.status(200).json({
                metadata: 'Login Success',
                data: user
            })   
            req.session.user = user
        }
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.post('/dosen', async (req, res) => {
    const { NIDN, password } = req.body

    try {
        const user = await passwordCheck("NIDN", "dosen", NIDN, password, res)
        if(user) {
            res.status(200).json({
                metadata: 'Login Success',
                data: user
            })   
            req.session.user = user
        }
    } catch(e) {
        res.status(500).send(e.message)
    }
})

module.exports = router