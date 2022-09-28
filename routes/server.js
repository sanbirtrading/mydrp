const express = require('express');
const isAuthenticated = require('../config/isAuthenticated');
const isAdmin = require('../config/isAdmin');
const serverController = require('../controllers/server');

const router = express.Router();

router.post('/post', isAuthenticated, serverController.postServer);
router.post('/delete/:id', isAuthenticated, serverController.deleteServer);
router.post('/edit/:id', isAuthenticated, serverController.editServer);
router.post(
  '/change-status/:id',
  isAuthenticated,
  serverController.changeStatus
);
router.get('/', isAuthenticated, serverController.getServer);

module.exports = router;
