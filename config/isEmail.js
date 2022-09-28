const db = require('../models');
module.exports = async function (email) {
  // If the user is logged in, continue with the request to the restricted route
  try {
    const count = await db.User.count({ where: { email: email } });
    return count;
  } catch (err) {
    throw err;
  }
};
