const db = require('../models');
const Sequelize = require('sequelize');
const server = require('../models/server');
const request = require('./request')

exports.getWhitelist = async (req, res, next) => {
  var status = await request.getUserRequestStatus(req,res,next);
  try {
    if (true) { //req.user.is_manager
      var user_ids = req.user.id; //req.user.access_rights? JSON.parse(req.user.access_rights).map((user) => user.id): '';
      var ips = await db.IPWhitelist.findAll({
        raw: true,
        where: {
          ip_owner: user_ids,
        },
      });
    } else {
      var users = await db.User.findAll({
        raw: true,
      });
    }
    res.render('ip', {
      pageTitle: 'IP Whitelist',
      users: req.user.id_admin ? users : [],
      ips: ips,
      status: status,
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/ip');
  }
};

exports.postWhitelist = async (req, res, next) => {
  try {
    /*const server = await db.Server.findOne({
      ip: req.body.ip,
    });*/
    /*if (!server) {
      throw [{ msg: "Server doesn't exist for the IP!" }];
    }*/
    /*const requestCount = await db.Request.count({
      where: {
        request_issuer: parseInt(req.body.request_issuer),
        resolved: false,
      },
    });
    if (requestCount <= 0) {
      throw [{ msg: 'No IP requests for this user!' }];
    } else {
      const latestRequest = await db.Request.findOne({
        where: {
          request_issuer: parseInt(req.body.request_issuer),
          resolved: false,
        },
        order: [['createdAt', 'DESC']],
      });
      latestRequest.resolved = true;
      await latestRequest.save();
    }*/
    
    // Backend Validation for the addresses limit
    // Error Handler will display that the maximum limit of address is excedeed
    // For double security only -> Frontend validation at first
    const ip_wl = await db.IPWhitelist.findAll({
        raw: true,
        where: {
          ip_owner:req.user.id
        }
    });
    if (ip_wl.length === 15){
      throw('address limit of 15 exceeded');
    }
    // Ip creation
    const ip = await db.IPWhitelist.create({
      ip: req.body.ip,
      description: req.body.description,
      is_whitelisted: false,
      ip_owner: parseInt(req.body.request_issuer),
    });
    if (!req.user.is_admin){
      const request = await db.Request.create({
        request_type: 'Whitelist IP',
        description: `Whitelist IP-${req.body.ip}`,
        request_issuer: req.user.id,
        resolved: false,
      });
    }
    req.flash('success_alert_message', 'IP has been created!');
    res.redirect(303, '/ip');


  } catch (err) {
    if (err.length > 0 && 'msg' in err[0]) {
      req.flash('error_message', err[0].msg);
    } else if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    } else {
      req.flash('error_message', err[0].msg);
    }
    res.redirect(303, '/ip');
  }
};

exports.deleteWhitelist = async (req, res, next) => {
  try {
    const ip = await db.IPWhitelist.findOne({
      where: {
        id: req.params.id,
      },
    });
    await ip.destroy();
    // Delete the request used to delete the ip, except if the user is admin
    // Who can always make requests
    if (!req.user.is_admin){
      await request.deleteRequest(req,res,next, 'Delete IP');
    }
    req.flash('success_alert_message', 'IP has been deleted!');
    res.redirect(303, '/ip');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/ip');
  }
};
