const express = require('express');
const isAuthenticated = require('../config/isAuthenticated');
const isAdmin = require('../config/isAdmin');
const machineController = require('../controllers/machine');
const serverController = require('../controllers/server');

const router = express.Router();

router.post('/post', isAuthenticated, isAdmin, machineController.postMachine);
router.post(
  '/delete/:id',
  isAuthenticated,
  isAdmin,
  machineController.deleteMachine
);
router.post(
  '/edit/:id',
  isAuthenticated,
  isAdmin,
  machineController.editMachine
);
router.get('/', isAuthenticated, isAdmin, machineController.getMachine);
router.get('/:id/servers', isAuthenticated, isAdmin, serverController.getServersbyMachine);

module.exports = router;
