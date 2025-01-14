const bcrypt = require('bcrypt')
const LoginModel = require('../models/register')

const passwordCheck = async(Induk, table, NIMorNIDN, password, res) => {
    const Login = LoginModel(Induk, table)

    const user = await Login.findOne({where: { [Induk]: NIMorNIDN }})
    if (!user) {
        res.status(400).json({ message: `${Induk} tidak ditemukan` });
        return false;
    }

    const validatePassword = await bcrypt.compare(password, user.password)
    if (!validatePassword) {
        res.status(400).json({ message: 'password salah' });
        return false;
    }

    return user
}

module.exports = passwordCheck