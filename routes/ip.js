const express = require('express');
const isAuthenticated = require('../config/isAuthenticated');
const ipController = require('../controllers/ip');

const router = express.Router();

router.get('/', isAuthenticated, ipController.getWhitelist);
router.post('/post-whitelist', isAuthenticated, ipController.postWhitelist);
router.post(
  '/delete-whitelist/:id',
  isAuthenticated,
  ipController.deleteWhitelist
);


module.exports = router;
