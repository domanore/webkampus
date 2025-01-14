const checkEmail = async (model, email, identifier, value, res) => {
  // Cek apakah email sudah terdaftar
  const existingEmail = await model.findOne({ where: { email } });

  // Cek apakah identifier (NIM/NIDN) sudah terdaftar
  const existingIdentifier = await model.findOne({ where: { [identifier]: value } });

  if (existingEmail) {
    res.status(400).json({ message: 'Email sudah terdaftar' });
    return true;
  }
  if (existingIdentifier) {
    res.status(400).json({ message: `${identifier} sudah terdaftar` });
    return true;
  }
  return false;
};

module.exports = checkEmail;