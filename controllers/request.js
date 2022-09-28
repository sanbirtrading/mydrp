const db = require('../models');
const Sequelize = require('sequelize');
const moment = require('moment');
const { request } = require('express');

exports.getRequests = async (req, res, next) => {
  try {
    const requests = await db.Request.findAll({
      order: [['createdAt', 'DESC']],
      include: db.User,
      raw: true,
    });
    res.render('requests', {
      pageTitle: 'Requests',
      requests,
      moment,
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/request');
  }
};

exports.getRequest = async (req, res, next) => {
  try {
    const requests = await db.Request.findAll({
      where: {
        id: req.params.id,
      },
      include: db.User,
      raw: true,
    });
    res.render('requests', {
      pageTitle: 'Requests',
      requests,
      moment,
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/request');
  }
};

// Function that return the status of the current user request
exports.getUserRequestStatus = async (req, res, next) => {
  try {
    const deleteRequests = await db.Request.findAll({
      where: {
        request_issuer: req.user.id,
        request_type: "Delete IP",
        resolved: true
      },
      include: db.User,
      raw: true,
    });
    return {delete: deleteRequests[0] ? {go:true, id: deleteRequests[0].id, type: "Delete IP"} : false}
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/request');
  }
};

/*exports.postWhitelistRequest = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.user_id },
      raw: true,
    });

    const request = await db.Request.create({
      request_type: 'Whitelist IP',
      description: `Whitelist IP - ${user.first_name} ${user.last_name}`,
      request_issuer: user.id,
      resolved: false,
    });
    req.flash(
      'success_alert_message',
      'IP Whitelist Request has been created!'
    );
    res.redirect(303, '/ip');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/ip');
  }
};*/

exports.deleteWhitelistRequest = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.user_id },
      raw: true,
    });

    const request = await db.Request.create({
      request_type: 'Delete IP',
      description: `Delete IP - ${user.first_name} ${user.last_name}`,
      request_issuer: user.id,
      resolved: false,
    });
    req.flash(
      'success_alert_message',
      'Delete IP Request has been created!'
    );
    res.redirect(303, '/ip');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/ip');
  }
};


exports.postServerRequest = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.user_id },
      raw: true,
    });
    const request = await db.Request.create({
      request_type: 'Server',
      description: `Server IP - ${user.first_name} ${user.last_name}`,
      request_issuer: user.id,
      resolved: false,
    });
    console.log(request);
    req.flash('success_alert_message', 'Server Request has been created!');
    res.redirect(303, '/server');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.deleteRequest = async (req, res, next, type) => {
  try {
    const request = await db.Request.findOne({
      where: {
        id: req.body.request_id 
      },
    });
    await request.destroy();
    } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
  }
}

exports.acceptRequest = async (req,res,next) => {
  try {
    const request = await db.Request.findOne({
      where: {
        id: req.body.request_id 
      },
    });
    if (request.request_type === 'Whitelist IP'){
      const ip = await db.IPWhitelist.findOne({
        where: {
          ip: request.description.split('-')[1]
        }
      });
      ip.is_whitelisted=true;
      await ip.save();
      request.resolved=true;
      await request.save();
      await db.Notification.create({
        description: `${request.request_type} Request accepted`,
        is_read: false,
        receiver: request.request_issuer
      });
      req.flash('success_alert_message', 'Request accepted');
      res.redirect('/request');
    } else if (request.request_type === 'Delete IP'){
      request.resolved=true;
      await request.save();
      await db.Notification.create({
        description: `${request.request_type} Request accepted`,
        is_read: false,
        receiver: request.request_issuer
      });
      req.flash('success_alert_message', 'Request accepted');
      res.redirect('/request');
    } else {
      request.resolved=true;
      await request.save();
      await db.Notification.create({
        description: `${request.request_type} Request accepted`,
        is_read: false,
        receiver: request.request_issuer
      });
      req.flash('success_alert_message', 'Request accepted');
      res.redirect('/request');
    }
  } catch (err) {
      req.flash('error_message', 'request not found');
      res.redirect('/request');
  }
}

exports.DeclineRequest = async (req,res,next) => {
  try {
    const request = await db.Request.findOne({
      where: {
        id: req.body.request_id 
      },
    });
    await db.Notification.create({
      description: `${request.request_type} Request denied`,
      is_read: false,
      receiver: request.request_issuer
    });
    await request.destroy();
    req.flash('success_alert_message', 'Request denied correctly');
    res.redirect('/request');
  } catch {
    req.flash('error_message', 'request not found');
    res.redirect('/request');
  }
}