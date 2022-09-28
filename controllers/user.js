const db = require('../models');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const isEmail = require('../config/isEmail');
const isUsername = require('../config/isUsername');
const { validationResult } = require('express-validator');
const { notify } = require('../routes/auth');

exports.getUser = async (req, res, next) => {
  try {
    const usersCount = await db.User.count();
    const serversCount = await db.Server.count();
    const activeServersCount = await db.Server.count({
      where: {
        status: true,
      },
    });
    const freeServersCount = await db.Server.count({
      where: {
        server_owner: null,
      },
    });
    const usedServersCount = await db.Server.count({
      where: {
        server_owner: { [Op.not]: null },
      },
    });
    console.log('Used Servers:', usedServersCount);
    if (req.user.is_manager) {
      var user_ids = req.user.access_rights
        ? JSON.parse(req.user.access_rights).map((user) => user.id)
        : '';
      var disabledServersCount = await db.Server.count({
        where: {
          status: false,
          server_owner: user_ids,
        },
      });
      var totalServersPerUser = await db.Server.findAll({
        attributes: [
          'server_owner',
          [
            Sequelize.fn('COUNT', Sequelize.col('status')),
            'count_total_servers',
          ],
        ],
        raw: true,
        where: {
          server_owner: user_ids,
        },
        group: 'server_owner',
      });
      if (!totalServersPerUser || totalServersPerUser.length <= 0) {
        totalServersPerUser = 0;
      }
      var totalActiveServersPerUser = await db.Server.findAll({
        attributes: [
          'server_owner',
          [
            Sequelize.fn('COUNT', Sequelize.col('status')),
            'count_active_servers',
          ],
        ],
        group: 'server_owner',
        where: {
          status: true,
          server_owner: user_ids,
        },
        raw: true,
      });
      if (!totalActiveServersPerUser || totalActiveServersPerUser.length <= 0) {
        totalActiveServersPerUser = 0;
        var user_ids = false;
        var users = false;
      } else {
        var users = await db.User.findAll({
          where: {
            id: user_ids,
          },
          raw: true,
        });
      }
      var totalDisabledServersPerUser = await db.Server.findAll({
        attributes: [
          'server_owner',
          [
            Sequelize.fn('COUNT', Sequelize.col('status')),
            'count_disabled_servers',
          ],
        ],
        group: 'server_owner',
        where: {
          status: false,
          server_owner: user_ids,
        },
        raw: true,
      });
      if (
        !totalDisabledServersPerUser ||
        totalDisabledServersPerUser.length <= 0
      ) {
        totalDisabledServersPerUser = 0;
      }
    } else {
      var disabledServersCount = await db.Server.count({
        where: {
          status: false,
        },
      });
      var totalServersPerUser = await db.Server.findAll({
        attributes: [
          'server_owner',
          [
            Sequelize.fn('COUNT', Sequelize.col('status')),
            'count_total_servers',
          ],
        ],
        raw: true,
        group: 'server_owner',
      });
      if (!totalServersPerUser || totalServersPerUser.length <= 0) {
        totalServersPerUser = 0;
      }
      var totalActiveServersPerUser = await db.Server.findAll({
        attributes: [
          'server_owner',
          [
            Sequelize.fn('COUNT', Sequelize.col('status')),
            'count_active_servers',
          ],
        ],
        group: 'server_owner',
        where: {
          status: true,
        },
        raw: true,
      });
      if (!totalActiveServersPerUser || totalActiveServersPerUser.length <= 0) {
        totalActiveServersPerUser = 0;
        var user_ids = false;
        var users = false;
      } else {
        var user_ids = totalServersPerUser.map((server) => server.server_owner);
        var users = await db.User.findAll({
          where: {
            id: user_ids,
          },
          raw: true,
        });
      }
      var totalDisabledServersPerUser = await db.Server.findAll({
        attributes: [
          'server_owner',
          [
            Sequelize.fn('COUNT', Sequelize.col('status')),
            'count_disabled_servers',
          ],
        ],
        group: 'server_owner',
        where: {
          status: false,
        },
        raw: true,
      });
      if (
        !totalDisabledServersPerUser ||
        totalDisabledServersPerUser.length <= 0
      ) {
        totalDisabledServersPerUser = 0;
      }
    }
    if (req.user.is_admin) {
      res.render('normal-users', {
        pageTitle: 'User',
        usersCount,
        serversCount,
        usedServersCount,
        freeServersCount,
        activeServersCount,
        disabledServersCount,
        totalServersPerUser,
        totalActiveServersPerUser,
        totalDisabledServersPerUser,
        users,
      });
    } else {
      res.redirect(303, '/server');
    }
  } catch (err) {
    res.json(err);
    res.status(422).json(err.errors[0].message);
  }
};

exports.getSubUser = async (req, res, next) => {
  try {
    const users = await db.User.findAll({
      where: {
        is_manager: true,
        parent_user: req.user.id
      },
      raw: true,
    });
    const normalUsers = await db.User.findAll({
      where: {
        is_manager: false,
        is_admin: true,
      },
      raw: true,
    });
    var serverList = [];
    for (var i=0; i<users.length; i++){
      serverList.push([]);
      if (users[i].parent_id){
        users[i].parent_id.split(' ').forEach(server => {
          server.split('-').forEach((item,count) => {
            if (count !== 0){
              if (count===2){
                serverList[i].push(`${item},`);
              } else {
                serverList[i].push(item);
              }
            }
          });
        })
      }
    }
    res.render('sub-user', {
      pageTitle: 'Users',
      users,
      normalUsers,
      serverList
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
  }
};

exports.postSubUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const username = await isUsername(req.body.username);

    if (username) {
      throw [
        {
          msg: 'Username already exists!',
        },
      ];
    }
    const email = await isEmail(req.body.email);
    if (email) {
      throw [
        {
          msg: 'Email already exists!',
        },
      ];
    }
    const body = req.body;
    const server_list_exists = 'server_list' in body;
    var parent_id = '';
    if (server_list_exists) {
      if (!Array.isArray(req.body.server_list)) {
        var server_split = req.body.server_list.split(' ');
        parent_id = `${server_split[0]}-${server_split[1]}-${server_split[2]}`;
      } else {
        for (server of req.body.server_list) {
          var server_split = server.split(' ');
          parent_id += `${server_split[0]}-${server_split[1]}-${server_split[2]} `;
        }
      }
    } else {
      parent_id = null;
    } 
    const user = await db.User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      is_manager: true,
      parent_id: parent_id,
      parent_user: req.user.id,
    });
    req.flash('success_alert_message', 'User has been created!');
    res.redirect(303, '/user/sub-users');
  } catch (err) {
    if (err.length > 0 && 'msg' in err[0]) {
      req.flash('error_message', err[0].msg);
    } else if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    } else {
      req.flash('error_message', err[0].msg);
    }
    res.redirect(303, '/user/sub-users');
  }
};

exports.editSubUser = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { id: req.params.id } });
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();
    req.flash('success_alert_message', 'User has been updated!');
    res.redirect(303, '/user/sub-users');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/user/sub-users');
  }
};

exports.deleteSubUser = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.id },
    });
    await user.destroy();
    req.flash('success_alert_message', 'User has been deleted!');
    res.redirect(303, '/user/sub-users');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/user/sub-users');
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { id: req.body.id } });
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();
    req.flash('success_alert_message', 'User has been updated!');
    res.redirect(303, '/user');
  } catch (err) {
    req.flash('error_message', err.errors[0].message);
    res.redirect(303, '/user');
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const username = await isUsername(req.body.username);

    if (username) {
      throw [
        {
          msg: 'Username already exists!',
        },
      ];
    }
    const email = await isEmail(req.body.email);
    if (email) {
      throw [
        {
          msg: 'Email already exists!',
        },
      ];
    }
    const user = await db.User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    req.flash('success_alert_message', 'User has been created!');
    res.redirect(303, '/user');
  } catch (err) {
    if (err.length > 0 && 'msg' in err[0]) {
      req.flash('error_message', err[0].msg);
    } else if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    } else {
      req.flash('error_message', err[0].msg);
    }
    res.redirect(303, '/user');
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { id: req.params.id } });
    await user.destroy();
    req.flash('success_alert_message', 'User has been deleted!');
    res.redirect(303, '/user');
  } catch (err) {
    req.flash('error_message', err[0].msg);
    res.redirect(303, '/user');
  }
};
