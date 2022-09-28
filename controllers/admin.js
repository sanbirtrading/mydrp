const db = require('../models');
const { validationResult } = require('express-validator');
const isEmail = require('../config/isEmail');
const isUsername = require('../config/isUsername');

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const username = await isUsername(req.body.username);
    if (username) {
      throw [
        {
          msg: 'Username already exists!',
        },
      ];
    }
    const email = await isEmail(req.body.email);
    if (email) {
      throw [
        {
          msg: 'Email already exists!',
        },
      ];
    }
    const user = await db.User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      is_admin: true,
    });
    res.redirect(307, '/auth/login');
  } catch (err) {
    if (err.length > 0 && 'msg' in err[0]) {
      req.flash('error_message', err[0].msg);
    } else if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    } else {
      req.flash('error_message', err.message);
    }

    res.redirect(303, '/admin/signup');
  }
};
