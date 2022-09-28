const passport = require('passport');
const authController = require('../controllers/auth');
const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
});

router.get('/login', (req, res, next) =>
  res.render('login', { pageTitle: 'Log In' })
);
//
// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post(
  '/signup',
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email must be correct!'),
  body('username')
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage('Field must not be empty!'),
  body('first_name')
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage('Field must not be empty!'),
  body('last_name')
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage('Field must not be empty!'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 chars long!'),
  authController.signup
);

router.get('/signup', (req, res, next) =>
  res.render('signup', { pageTitle: 'Sign Up' })
);
//
// Route for logging user out
router.get('/logout', authController.logOut);
//
// Route for getting some data about our user to be used client side
router.get('/user_data', authController.userData);

router.post('/password_forgot', authController.passwordForgot);

module.exports = router;
