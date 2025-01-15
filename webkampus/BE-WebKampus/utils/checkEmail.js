const User = require('../models/user');
/**
 * @param {string} email
 * @param {number} [nim]
 * @param {number} [nidn]
 * @returns {Promise<{ emailExists: boolean, nimExists: boolean, nidnExists: boolean }>}
 */
const checkEmail = async (email, nim, nidn) => {
  try {
    const emailExists = await User.findOne({ where: { email } });

    const nimExists = nim ? await User.findOne({ where: { nim } }) : false;

    const nidnExists = nidn ? await User.findOne({ where: { nidn } }) : false;

    return {
      emailExists: !!emailExists,
      nimExists: !!nimExists,
      nidnExists: !!nidnExists
    };
  } catch (error) {
    console.error('Error checking email, NIM, or NIDN:', error);
    throw error;
  }
};

module.exports = checkEmail;