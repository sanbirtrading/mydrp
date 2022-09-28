const db = require('../models');
const { validationResult } = require('express-validator');
const isEmail = require('../config/isEmail');
const isUsername = require('../config/isUsername');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    // console.log(errors);
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

    res.redirect(303, '/auth/signup');
  }
};

exports.logOut = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success_alert_message', 'You have succesfully logged out');
    res.redirect('/auth/login');
  });
};

exports.userData = (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      username: req.user.username,
      id: req.user.id,
    });
  }
};

exports.passwordForgot = async (req, res) => {
    const user = await db.User.findOne({
      where: {
        username: req.body.username
      }
    })
    const email = user.email;
    const newPassword = Math.random().toString(36).slice(2);
    user.password = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(10),
      null
    );
    user.save();
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'teseonicolo@gmail.com',
        pass: 'iphiqyddfxersckm' //iphiqyddfxersckm
      }
    });
    var mailOptions = {
      from: 'teseonicolo@gmail.com',
      to: email,
      subject: 'Password changed',
      text: `New Password: ${newPassword}`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        req.flash('error_message', error);
      } else {
        req.flash('success_alert_message', "Check your mail inbox");
      }
      res.redirect('/auth/login');
    });
}
