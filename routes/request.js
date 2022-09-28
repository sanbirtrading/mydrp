const express = require('express');
const isAuthenticated = require('../config/isAuthenticated');
const isAdmin = require('../config/isAdmin');
const requestController = require('../controllers/request');

const router = express.Router();

/*router.post(
  '/ip/:user_id',
  isAuthenticated,
  requestController.postWhitelistRequest
);*/
router.post(
  '/server/:user_id',
  isAuthenticated,
  requestController.postServerRequest
);
router.post(
  '/delete/:user_id',
  isAuthenticated,
  requestController.deleteWhitelistRequest
);
router.post(
  '/accept/',
  isAdmin,
  requestController.acceptRequest
);
router.post(
  '/decline/',
  isAdmin,
  requestController.DeclineRequest
);
router.get('/:id', isAdmin, requestController.getRequest);
router.get('/', isAdmin, requestController.getRequests);

module.exports = router;
