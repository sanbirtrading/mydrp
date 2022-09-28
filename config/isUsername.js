const db = require('../models');
module.exports = async function (username) {
  // If the user is logged in, continue with the request to the restricted route
  try {
    const count = await db.User.count({ where: { username: username } });
    return count;
  } catch (err) {
    throw err;
  }
};
