const db = require('../models');
const Sequelize = require('sequelize');

exports.getServer = async (req, res, next) => {
  try {
    const machines = await db.Machine.findAll({
      where: {
        status: true,
      },
      raw: true,
    });
    if (!req.user.is_admin) { // req.user.is_manager
      /*var user_ids = req.user.access_rights
        ? JSON.parse(req.user.access_rights).map((user) => user.id)
        : '';*/
      var users = await db.User.findAll({
        where: {
          id: req.user.id,
        },
      });
      var servers = await db.Server.findAll({
        include: db.User,
        raw: true,
        where: {
          server_owner: req.user.id,
        },
      });
    } else {
      var users = await db.User.findAll();
      var servers = await db.Server.findAll({
        include: db.User,
        raw: true,
      });
    }

    res.render('server', {
      pageTitle: 'Server',
      users,
      servers,
      machines,
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.postServer = async (req, res, next) => {
  try {
    if (req.body.unique_id && req.body.user) {
      var status = false;
    } else {
      var status = false;
    }
    // The admin doesn't need to request to add a server
    if (!req.user.is_admin){
      const request = await db.Request.findOne({
        where: {
          request_issuer: parseInt(req.body.user),
        },
      });
      if (!request) {
        throw [{ msg: "Server request doesn't exist for IP!" }];
      }
    }
    if (!('machine' in req.body)) {
      throw [{ msg: "Machine doesn't exist for IP!" }];
    }
    const server = await db.Server.create({
      ip: req.body.ip,
      port: req.body.port,
      server_owner: parseInt(req.body.user),
      machine_id: parseInt(req.body.machine),
      status: status,
      password: req.body.password,
      unique_id: req.body.unique_id,
      cpu: req.body.cpu,
      ram: req.body.ram,
      hard_disk: req.body.hard_disk,
      admin_password: req.body.admin_password,
      price: parseFloat(50),
    });
    if (!req.user.is_admin){
      request.resolved = true;
      await request.save();
    }
    req.flash('success_alert_message', 'Server has been successfully added!');
    res.redirect(302, '/server');
  } catch (err) {
    if (err.length > 0 && 'msg' in err[0]) {
      req.flash('error_message', err[0].msg);
    } else if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    } else {
      req.flash('error_message', err.message);
    }
    res.redirect(303, '/server');
  }
};

exports.editServer = async (req, res, next) => {
  try {
    const server = await db.Server.findOne({
      where: {
        id: req.params.id,
      },
    });
    if ('status' in req.body) {
      var status = req.body.status;
    } else {
      var status = false;
    }
    server.ip = req.body.ip;
    server.port = req.body.port;
    server.password = req.body.password;
    server.cpu = req.body.cpu;
    server.ram = req.body.ram;
    server.status = status;
    server.hard_disk = req.body.hard_disk;
    server.unique_id = req.body.unique_id;
    await server.save();

    req.flash('success_alert_message', 'Server has been successfully updated!');
    res.redirect(302, '/server');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('Id: ' + id);
    const server = await db.Server.update(
      {
        status: Sequelize.literal('NOT status'),
      },
      { where: { id } }
    );

    req.flash('success_alert_message', 'Status successfully changed!');
    res.redirect(302, '/server');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.deleteServer = async (req, res, next) => {
  try {
    const server = await db.Server.findOne({
      where: {
        id: req.params.id,
      },
    });
    await server.destroy();
    req.flash('success_alert_message', 'Server has been successfully deleted!');
    res.redirect(302, '/server');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.getServersbyMachine = async (req,res,next) => {
  try {
    // list of servers connected to the passed machine
    const servers = await db.Server.findAll({
      where: {
        machine_id: req.params.id,
      },
      raw: true
    });
    // machine passed for fronted 
    const machine = await db.Machine.findOne({
      where: {
        id: req.params.id
      },
      raw: true
    });
    // machines for creating or editing a new server
    const machines = await db.Machine.findAll({
      raw: true
    });
    const users = await db.User.findAll({
      where: {
        is_admin: false
      },
      raw: true
    })
    res.render('servers-by-machine', {
      pageTitle: `Servers connected to machine ${req.params.id}`,
      servers,
      machine,
      machines,
      users
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/machine');
  }
};