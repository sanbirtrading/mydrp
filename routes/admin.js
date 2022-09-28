const adminController = require('../controllers/admin');
const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

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
  adminController.signup
);

router.get('/signup', (req, res, next) =>
  res.render('admin-signup', { pageTitle: 'Admin Sign Up' })
);

module.exports = router;
