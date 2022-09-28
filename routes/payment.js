const express = require('express');
const isAuthenticated = require('../config/isAuthenticated');

const router = express.Router();

router.get('/', isAuthenticated, (req, res, next) =>
  res.render('payment-history', {
    pageTitle: 'Payment History',
  })
);
module.exports = router;
