const express = require('express');
const isAuthenticated = require('../config/isAuthenticated');
const NotificationsController = require('../controllers/notifications');

const router = express.Router();

router.post('/clear', isAuthenticated, NotificationsController.clearNotificationInbox);

module.exports = router;