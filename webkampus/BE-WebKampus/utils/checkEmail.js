const User = require('../models/user');

const checkEmail = async (email, nidn) => {
  try {
    const whereClause = { email };
    
    const emailExists = await User.findOne({ where: whereClause });

    const nidnExists = nidn 
      ? await User.findOne({ where: { nidn } }) 
      : false;

    return {
      emailExists: !!emailExists,
      nidnExists: !!nidnExists
    };
  } catch (error) {
    console.error('Error checking email or NIDN:', error);
    throw error;
  }
};

module.exports = checkEmail;